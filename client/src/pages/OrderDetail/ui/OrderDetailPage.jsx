import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Breadcrumb, Card, Alert, Spinner, Button, Badge, Modal, Form } from 'react-bootstrap';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { checkoutApi } from '../../../features/checkout';
import { SHOP_ROUTE } from '../../../shared/config/route-constants';
import './OrderDetailPage.scss';

const OrderDetailPage = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [isCancelling, setIsCancelling] = useState(false);

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

    const getStatusBadge = (status) => {
        const statusMap = {
            'pending': { text: 'В обработке', variant: 'info' },
            'processing': { text: 'Обрабатывается', variant: 'primary' },
            'shipped': { text: 'Отправлен', variant: 'warning' },
            'delivered': { text: 'Доставлен', variant: 'success' },
            'cancelled': { text: 'Отменен', variant: 'danger' }
        };

        const statusInfo = statusMap[status] || { text: status, variant: 'secondary' };
        return <Badge bg={statusInfo.variant}>{statusInfo.text}</Badge>;
    };

    const getPaymentMethodText = (method) => {
        const methodMap = {
            'cash': 'Наличными при получении',
            'card': 'Банковской картой',
            'bank_transfer': 'Банковский перевод'
        };
        return methodMap[method] || method;
    };

    const getPaymentStatusBadge = (status) => {
        const statusMap = {
            'pending': { text: 'Ожидает оплаты', variant: 'warning' },
            'paid': { text: 'Оплачен', variant: 'success' },
            'failed': { text: 'Ошибка оплаты', variant: 'danger' },
            'refunded': { text: 'Возврат средств', variant: 'info' }
        };

        const statusInfo = statusMap[status] || { text: status, variant: 'secondary' };
        return <Badge bg={statusInfo.variant}>{statusInfo.text}</Badge>;
    };

    const handleCancelOrder = async () => {
        try {
            setIsCancelling(true);
            await checkoutApi.cancelOrder(orderId, cancelReason);
            setShowCancelModal(false);
            
            // Обновляем данные заказа
            const updatedOrder = await checkoutApi.getOrderDetails(orderId);
            setOrder(updatedOrder);
        } catch (err) {
            console.error('Ошибка при отмене заказа:', err);
            setError('Не удалось отменить заказ');
        } finally {
            setIsCancelling(false);
        }
    };

    const canBeCancelled = (status) => {
        // Заказ можно отменить, если он еще не отправлен и не отменен
        return ['pending', 'processing'].includes(status);
    };

    return (
        <Container fluid className="order-detail-page py-4">
            <Row className="justify-content-center">
                <Col xs={12} lg={10}>
                    <Breadcrumb className="mb-4">
                        <Breadcrumb.Item linkAs={Link} linkProps={{ to: SHOP_ROUTE }}>
                            Главная
                        </Breadcrumb.Item>
                        <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/orders' }}>
                            Мои заказы
                        </Breadcrumb.Item>
                        <Breadcrumb.Item active>Заказ №{order?.order_number}</Breadcrumb.Item>
                    </Breadcrumb>

                    <h1 className="mb-4">Детали заказа</h1>

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
                        <Card className="order-detail-card">
                            <Card.Header className="d-flex justify-content-between align-items-center">
                                <h5 className="mb-0">Заказ №{order.order_number}</h5>
                                <div className="d-flex align-items-center">
                                    <span className="me-2">Статус:</span>
                                    {getStatusBadge(order.status)}
                                </div>
                            </Card.Header>
                            <Card.Body>
                                <Row className="mb-4">
                                    <Col md={6}>
                                        <h5 className="mb-3">Информация о заказе</h5>
                                        <p><strong>Дата:</strong> {new Date(order.created_at).toLocaleString('ru-RU')}</p>
                                        <p>
                                            <strong>Способ оплаты:</strong> {getPaymentMethodText(order.payment_method)}
                                        </p>
                                        <p>
                                            <strong>Статус оплаты:</strong> {' '}
                                            {getPaymentStatusBadge(order.payment_status)}
                                        </p>
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
                                                        <div className="d-flex align-items-center">
                                                            {item.product.images && item.product.images.length > 0 && (
                                                                <img 
                                                                    src={process.env.REACT_APP_API_URL + item.product.images[0].img}
                                                                    alt={item.product.name}
                                                                    className="me-2 order-item-image"
                                                                    width="50"
                                                                    height="50"
                                                                />
                                                            )}
                                                            <div>
                                                                <p className="mb-0">{item.product.name}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="text-center">{item.quantity}</td>
                                                    <td className="text-end">{parseFloat(item.price).toLocaleString('ru-RU')} ₽</td>
                                                    <td className="text-end">{(parseFloat(item.price) * item.quantity).toLocaleString('ru-RU')} ₽</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <td colSpan="3" className="text-end">Сумма заказа:</td>
                                                <td className="text-end">{parseFloat(order.total_amount).toLocaleString('ru-RU')} ₽</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>

                                {order.notes && (
                                    <div className="mt-4">
                                        <h5 className="mb-2">Комментарий к заказу</h5>
                                        <p className="notes-text">{order.notes}</p>
                                    </div>
                                )}

                                <div className="mt-4 d-flex justify-content-between">
                                    <Button
                                        variant="outline-secondary"
                                        onClick={() => navigate('/orders')}
                                    >
                                        Вернуться к списку заказов
                                    </Button>

                                    {canBeCancelled(order.status) && (
                                        <Button
                                            variant="danger"
                                            onClick={() => setShowCancelModal(true)}
                                        >
                                            Отменить заказ
                                        </Button>
                                    )}
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

            {/* Модальное окно отмены заказа */}
            <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Отмена заказа</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Вы уверены, что хотите отменить заказ №{order?.order_number}?</p>
                    <Form.Group>
                        <Form.Label>Причина отмены (необязательно)</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            placeholder="Укажите причину отмены заказа"
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowCancelModal(false)} disabled={isCancelling}>
                        Отмена
                    </Button>
                    <Button variant="danger" onClick={handleCancelOrder} disabled={isCancelling}>
                        {isCancelling ? 'Отмена заказа...' : 'Отменить заказ'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default OrderDetailPage; 