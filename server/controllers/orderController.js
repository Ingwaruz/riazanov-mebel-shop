const ApiError = require('../error/ApiError');
const { Order, OrderItem, Product, User, Image } = require('../models/models');
const { Op } = require('sequelize');
const nodemailer = require('nodemailer');

class OrderController {
    // Создание заказа
    async create(req, res, next) {
        try {
            const {
                items,
                customer_name,
                customer_email,
                customer_phone,
                shipping_address,
                shipping_city,
                shipping_postal_code,
                payment_method,
                shipping_amount = 0,
                notes
            } = req.body;

            // Валидация
            if (!items || !Array.isArray(items) || items.length === 0) {
                return next(ApiError.badRequest('Корзина пуста'));
            }

            if (!customer_name || !customer_email || !customer_phone || !shipping_address || !shipping_city || !payment_method) {
                return next(ApiError.badRequest('Заполните все обязательные поля'));
            }

            // Генерируем номер заказа
            const order_number = Order.generateOrderNumber();

            // Создаем заказ
            const order = await Order.create({
                order_number,
                user_id: req.user?.id || null,
                customer_name,
                customer_email,
                customer_phone,
                shipping_address,
                shipping_city,
                shipping_postal_code,
                payment_method,
                shipping_amount,
                notes,
                status: 'pending',
                payment_status: 'pending'
            });

            // Создаем элементы заказа
            let total_amount = 0;
            const orderItems = [];

            for (const item of items) {
                const product = await Product.findByPk(item.product_id);
                if (!product) {
                    await order.destroy();
                    return next(ApiError.badRequest(`Товар с ID ${item.product_id} не найден`));
                }

                const orderItem = await OrderItem.create({
                    order_id: order.id,
                    product_id: item.product_id,
                    quantity: item.quantity || 1,
                    price: product.price,
                    discount: item.discount || 0
                });

                orderItems.push(orderItem);
                total_amount += orderItem.getSubtotal();
            }

            // Обновляем общую сумму заказа
            order.total_amount = total_amount + parseFloat(shipping_amount);
            await order.save();

            // Отправляем email подтверждение
            await this.sendOrderConfirmation(order, orderItems);

            // Получаем полный заказ с элементами
            const fullOrder = await Order.findByPk(order.id, {
                include: [{
                    model: OrderItem,
                    as: 'orderItems',
                    include: [{
                        model: Product,
                        as: 'product',
                        include: [{
                            model: Image,
                            as: 'images',
                            limit: 1
                        }]
                    }]
                }]
            });

            return res.json(fullOrder);
        } catch (e) {
            return next(ApiError.internal(e.message));
        }
    }

    // Получение списка заказов
    async getAll(req, res, next) {
        try {
            const { status, page = 1, limit = 10 } = req.query;
            const offset = (page - 1) * limit;

            const where = {};
            
            // Если пользователь не аутентифицирован или не админ - показываем только его заказы
            if (!req.user || req.user.role !== 'ADMIN') {
                if (req.user) {
                    where.user_id = req.user.id;
                } else {
                    // Если пользователь не аутентифицирован, возвращаем пустой список
                    return res.json({
                        count: 0,
                        rows: [],
                        pages: 0,
                        currentPage: parseInt(page)
                    });
                }
            }

            if (status) {
                where.status = status;
            }

            const orders = await Order.findAndCountAll({
                where,
                limit: parseInt(limit),
                offset: parseInt(offset),
                order: [['created_at', 'DESC']],
                include: [{
                    model: OrderItem,
                    as: 'orderItems',
                    include: [{
                        model: Product,
                        as: 'product'
                    }]
                }]
            });

            return res.json({
                count: orders.count,
                rows: orders.rows,
                pages: Math.ceil(orders.count / limit),
                currentPage: parseInt(page)
            });
        } catch (e) {
            return next(ApiError.internal(e.message));
        }
    }

    // Получение одного заказа
    async getOne(req, res, next) {
        try {
            const { id } = req.params;

            const order = await Order.findByPk(id, {
                include: [{
                    model: OrderItem,
                    as: 'orderItems',
                    include: [{
                        model: Product,
                        as: 'product',
                        include: [{
                            model: Image,
                            as: 'images'
                        }]
                    }]
                }, {
                    model: User,
                    attributes: ['id', 'email', 'name', 'phone_number']
                }]
            });

            if (!order) {
                return next(ApiError.notFound('Заказ не найден'));
            }

            // Проверяем доступ
            if (req.user.role !== 'ADMIN' && order.user_id !== req.user.id) {
                return next(ApiError.forbidden('Нет доступа к этому заказу'));
            }

            return res.json(order);
        } catch (e) {
            return next(ApiError.internal(e.message));
        }
    }

    // Обновление статуса заказа (только админ)
    async updateStatus(req, res, next) {
        try {
            const { id } = req.params;
            const { status, comment } = req.body;

            if (req.user.role !== 'ADMIN') {
                return next(ApiError.forbidden('Недостаточно прав'));
            }

            const order = await Order.findByPk(id);
            if (!order) {
                return next(ApiError.notFound('Заказ не найден'));
            }

            order.status = status;
            await order.save();

            // Отправляем уведомление клиенту об изменении статуса
            await this.sendStatusNotification(order);

            return res.json(order);
        } catch (e) {
            return next(ApiError.internal(e.message));
        }
    }

    // Отмена заказа
    async cancel(req, res, next) {
        try {
            const { id } = req.params;
            const { reason } = req.body;

            const order = await Order.findByPk(id);
            if (!order) {
                return next(ApiError.notFound('Заказ не найден'));
            }

            // Проверяем доступ
            if (req.user.role !== 'ADMIN' && order.user_id !== req.user.id) {
                return next(ApiError.forbidden('Нет доступа к этому заказу'));
            }

            // Проверяем, можно ли отменить заказ
            if (['delivered', 'cancelled'].includes(order.status)) {
                return next(ApiError.badRequest('Невозможно отменить заказ с текущим статусом'));
            }

            order.status = 'cancelled';
            if (reason) {
                order.notes = order.notes ? `${order.notes}\nПричина отмены: ${reason}` : `Причина отмены: ${reason}`;
            }
            await order.save();

            return res.json({ message: 'Заказ успешно отменен', order });
        } catch (e) {
            return next(ApiError.internal(e.message));
        }
    }

    // Отправка email подтверждения заказа
    async sendOrderConfirmation(order, orderItems) {
        try {
            // Настройка транспорта для отправки email
            const transporter = nodemailer.createTransport({
                host: process.env.EMAIL_HOST,
                port: process.env.EMAIL_PORT,
                secure: process.env.EMAIL_SECURE === 'true',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            // Формируем список товаров
            let itemsList = '';
            for (const item of orderItems) {
                const product = await Product.findByPk(item.product_id);
                const subtotal = item.getSubtotal();
                itemsList += `
                    <tr>
                        <td>${product.name}</td>
                        <td>${item.quantity}</td>
                        <td>${item.price} руб.</td>
                        <td>${subtotal} руб.</td>
                    </tr>
                `;
            }

            const mailOptions = {
                from: process.env.EMAIL_FROM,
                to: order.customer_email,
                subject: `Заказ №${order.order_number} оформлен`,
                html: `
                    <h2>Спасибо за ваш заказ!</h2>
                    <p>Ваш заказ №${order.order_number} успешно оформлен.</p>
                    
                    <h3>Детали заказа:</h3>
                    <table border="1" cellpadding="5">
                        <tr>
                            <th>Товар</th>
                            <th>Количество</th>
                            <th>Цена</th>
                            <th>Сумма</th>
                        </tr>
                        ${itemsList}
                    </table>
                    
                    <p><strong>Доставка:</strong> ${order.shipping_amount} руб.</p>
                    <p><strong>Итого:</strong> ${order.total_amount} руб.</p>
                    
                    <h3>Адрес доставки:</h3>
                    <p>${order.shipping_address}, ${order.shipping_city}${order.shipping_postal_code ? ', ' + order.shipping_postal_code : ''}</p>
                    
                    <p>Мы свяжемся с вами для подтверждения заказа.</p>
                    
                    <p>С уважением,<br>Команда ДОМУ МЕБЕЛЬ</p>
                `
            };

            await transporter.sendMail(mailOptions);
        } catch (error) {
            console.error('Ошибка отправки email:', error);
        }
    }

    // Отправка уведомления об изменении статуса
    async sendStatusNotification(order) {
        try {
            const transporter = nodemailer.createTransport({
                host: process.env.EMAIL_HOST,
                port: process.env.EMAIL_PORT,
                secure: process.env.EMAIL_SECURE === 'true',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            const statusTexts = {
                'processing': 'принят в обработку',
                'shipped': 'отправлен',
                'delivered': 'доставлен',
                'cancelled': 'отменен'
            };

            const mailOptions = {
                from: process.env.EMAIL_FROM,
                to: order.customer_email,
                subject: `Изменение статуса заказа №${order.order_number}`,
                html: `
                    <h2>Статус вашего заказа изменен</h2>
                    <p>Заказ №${order.order_number} ${statusTexts[order.status] || order.status}.</p>
                    
                    <p>С уважением,<br>Команда ДОМУ МЕБЕЛЬ</p>
                `
            };

            await transporter.sendMail(mailOptions);
        } catch (error) {
            console.error('Ошибка отправки уведомления:', error);
        }
    }
}

module.exports = new OrderController(); 