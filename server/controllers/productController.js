const uuid = require('uuid');
const path = require('path');
const {Product, ProductInfo} = require('../models/models');
const ApiError = require('../error/apiError');
const {sequelize} = require('../models/models');  // Экземпляр sequelize

class productController {
    async create(req, res, next) {
        console.log('Create product request received.');  // Лог начала обработки запроса

        const transaction = await sequelize.transaction();  // Создание транзакции
        try {
            let {name, price, factoryId, typeId, info} = req.body;
            const {img} = req.files;

            // Проверка на наличие всех необходимых полей
            if (!name || !price || !factoryId || !typeId || !img) {
                throw ApiError.badRequest('All fields must be filled');
            }

            // Генерация уникального имени файла с расширением
            const fileExtension = path.extname(img.name);
            let fileName = uuid.v4() + fileExtension;
            console.log('Generated file name:', fileName);  // Лог имени файла

            // Перемещение файла в нужную директорию
            img.mv(path.resolve(__dirname, '..', 'static', fileName), (err) => {
                if (err) {
                    console.log('Error moving file:', err);  // Лог ошибки при перемещении файла
                    throw ApiError.badRequest('File upload error');
                }
            });

            // Создание продукта
            console.log('Creating product...');
            const product = await Product.create(
                {name, price, factoryId, typeId, img: fileName},
                {transaction}
            );

            // Если есть дополнительная информация о продукте
            if (info) {
                info = JSON.parse(info);
                for (const element of info) {
                    await ProductInfo.create({
                        title: element.title,
                        description: element.description,
                        productId: product.id
                    }, {transaction});
                }
            }

            await transaction.commit();
            return res.json(product);
        } catch (e) {
            console.log('Error occurred:', e);  // Лог ошибки
            await transaction.rollback();  // Откат транзакции при ошибке
            console.log('Transaction rolled back.');
            next(ApiError.badRequest(e.message));
        }
    }

    async getAll(req, res, next) {

        try {
            let {factoryId, typeId, limit, page} = req.query;
            console.log('Request query:', req.query);  // Лог запроса
            page = page || 1;
            limit = limit || 9;
            let offset = (page - 1) * limit;
            let products;

            const query = {
                limit,
                offset,
                where: {}
            };

            if (factoryId) query.where.factoryId = factoryId;
            if (typeId) query.where.typeId = typeId;

            products = await Product.findAndCountAll(query);

            return res.json(products);
        } catch (e) {
            console.log('Error occurred:', e);  // Лог ошибки
            next(ApiError.badRequest(e.message));
        }
    }

    async getOne(req, res, next) {

        try {
            const {id} = req.params;
            const product = await Product.findOne({
                where: {id},
                include: [{model: ProductInfo, as: 'product_infos'}]
            });

            if (!product) {
                throw ApiError.badRequest('Product not found');
            }

            return res.json(product);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
}

module.exports = new productController();
