import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Breadcrumb, Card, Alert, Spinner, Button } from 'react-bootstrap';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { checkoutApi } from '../../../features/checkout';
import { SHOP_ROUTE } from '../../../shared/config/route-constants';
import './OrderConfirmationPage.scss';

const OrderConfirmationPage = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                setLoading(true);
                const data = await checkoutApi.getOrderDetails(orderId);
                setOrder(data);
            } catch (err) {
                console.error('Ошибка при получении заказа:', err);
                setError('Не удалось загрузить информацию о заказе');
            } finally {
                setLoading(false);
            }
        };

        if (orderId) {
            fetchOrder();
        }
    }, [orderId]);

    const getStatusText = (status) => {
        const statusMap = {
            'pending': 'В обработке',
            'processing': 'Обрабатывается',
            'shipped': 'Отправлен',
            'delivered': 'Доставлен',
            'cancelled': 'Отменен'
        };
        return statusMap[status] || status;
    };

    const getPaymentMethodText = (method) => {
        const methodMap = {
            'cash': 'Наличными при получении',
            'card': 'Банковской картой',
            'bank_transfer': 'Банковский перевод'
        };
        return methodMap[method] || method;
    };

    return (
        <Container fluid className="order-confirmation-page py-4">
            <Row className="justify-content-center">
                <Col xs={12} lg={10}>
                    <Breadcrumb className="mb-4">
                        <Breadcrumb.Item linkAs={Link} linkProps={{ to: SHOP_ROUTE }}>
                            Главная
                        </Breadcrumb.Item>
                        <Breadcrumb.Item active>Подтверждение заказа</Breadcrumb.Item>
                    </Breadcrumb>

                    <h1 className="mb-4">Подтверждение заказа</h1>

                    {loading ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" variant="primary" />
                            <p className="mt-3">Загрузка информации о заказе...</p>
                        </div>
                    ) : error ? (
                        <Alert variant="danger">
                            {error}
                        </Alert>
                    ) : order ? (
                        <Card className="confirmation-card">
                            <Card.Body>
                                <Alert variant="success" className="mb-4">
                                    <Alert.Heading>Заказ успешно оформлен!</Alert.Heading>
                                    <p>Благодарим вас за заказ! Мы отправили подтверждение на указанный email.</p>
                                </Alert>

                                <Row className="mb-4">
                                    <Col md={6}>
                                        <h5 className="mb-3">Информация о заказе</h5>
                                        <p><strong>Номер заказа:</strong> {order.order_number}</p>
                                        <p><strong>Дата:</strong> {new Date(order.created_at).toLocaleString('ru-RU')}</p>
                                        <p><strong>Статус:</strong> {getStatusText(order.status)}</p>
                                        <p><strong>Способ оплаты:</strong> {getPaymentMethodText(order.payment_method)}</p>
                                        <p><strong>Сумма заказа:</strong> {parseFloat(order.total_amount).toLocaleString('ru-RU')} ₽</p>
                                    </Col>
                                    <Col md={6}>
                                        <h5 className="mb-3">Данные получателя</h5>
                                        <p><strong>ФИО:</strong> {order.customer_name}</p>
                                        <p><strong>Email:</strong> {order.customer_email}</p>
                                        <p><strong>Телефон:</strong> {order.customer_phone}</p>
                                        <p><strong>Адрес доставки:</strong> {order.shipping_address}, {order.shipping_city}{order.shipping_postal_code ? `, ${order.shipping_postal_code}` : ''}</p>
                                    </Col>
                                </Row>

                                <h5 className="mb-3">Состав заказа</h5>
                                <div className="table-responsive">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>Товар</th>
                                                <th className="text-center">Количество</th>
                                                <th className="text-end">Цена</th>
                                                <th className="text-end">Сумма</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {order.orderItems && order.orderItems.map(item => (
                                                <tr key={item.id}>
                                                    <td>
                                                        {item.product.name}
                                                    </td>
                                                    <td className="text-center">{item.quantity}</td>
                                                    <td className="text-end">{parseFloat(item.price).toLocaleString('ru-RU')} ₽</td>
                                                    <td className="text-end">{(parseFloat(item.price) * item.quantity).toLocaleString('ru-RU')} ₽</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <th colSpan="3" className="text-end">Сумма заказа:</th>
                                                <th className="text-end">{parseFloat(order.total_amount).toLocaleString('ru-RU')} ₽</th>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>

                                <div className="mt-4 text-center">
                                    <Button 
                                        variant="primary" 
                                        className="bg-main_color me-3" 
                                        onClick={() => navigate(SHOP_ROUTE)}
                                    >
                                        Продолжить покупки
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    ) : (
                        <Alert variant="warning">
                            Заказ не найден
                        </Alert>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default OrderConfirmationPage; 