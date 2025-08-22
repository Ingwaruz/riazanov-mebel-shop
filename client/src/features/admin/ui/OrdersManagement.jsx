import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Button, Form, Row, Col, InputGroup, Pagination, Spinner, Alert, Modal, Dropdown } from 'react-bootstrap';
import { FaSearch, FaEye, FaEdit } from 'react-icons/fa';
import { checkoutApi } from '../../../features/checkout';
import './OrdersManagement.scss';

const OrdersManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState({
        status: 'all',
        search: '',
        page: 1,
        limit: 10
    });
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0
    });
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [newStatus, setNewStatus] = useState('');

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const params = {
                page: filter.page,
                limit: filter.limit
            };

            if (filter.status !== 'all') {
                params.status = filter.status;
            }

            if (filter.search) {
                params.search = filter.search;
            }

            const data = await checkoutApi.getAllOrders(params);
            setOrders(data.rows);
            setPagination({
                currentPage: data.currentPage || 1,
                totalPages: data.pages || 1,
                totalItems: data.count || 0
            });
        } catch (err) {
            console.error('Ошибка при получении заказов:', err);
            setError('Не удалось загрузить список заказов');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [filter.page, filter.status]);

    const handleSearch = (e) => {
        e.preventDefault();
        setFilter({ ...filter, page: 1 });
        fetchOrders();
    };

    const handlePageChange = (page) => {
        setFilter({ ...filter, page });
    };

    const handleFilterChange = (e) => {
        setFilter({ ...filter, status: e.target.value, page: 1 });
    };

    const handleSearchChange = (e) => {
        setFilter({ ...filter, search: e.target.value });
    };

    const handleViewOrder = async (orderId) => {
        try {
            setLoading(true);
            const orderData = await checkoutApi.getOrderDetails(orderId);
            setSelectedOrder(orderData);
            setShowOrderModal(true);
        } catch (err) {
            console.error('Ошибка при получении деталей заказа:', err);
            setError('Не удалось загрузить информацию о заказе');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = (orderId, status) => {
        setSelectedOrder(orders.find(order => order.id === orderId));
        setNewStatus(status);
        setShowStatusModal(true);
    };

    const updateOrderStatus = async () => {
        if (!selectedOrder || !newStatus) return;

        try {
            setUpdatingStatus(true);
            await checkoutApi.updateOrderStatus(selectedOrder.id, newStatus);
            setShowStatusModal(false);
            fetchOrders();
        } catch (err) {
            console.error('Ошибка при обновлении статуса:', err);
            setError('Не удалось обновить статус заказа');
        } finally {
            setUpdatingStatus(false);
        }
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

    const getPaginationItems = () => {
        const items = [];
        const maxPages = 5;
        const startPage = Math.max(1, pagination.currentPage - Math.floor(maxPages / 2));
        const endPage = Math.min(pagination.totalPages, startPage + maxPages - 1);

        if (pagination.currentPage > 1) {
            items.push(
                <Pagination.Prev key="prev" onClick={() => handlePageChange(pagination.currentPage - 1)} />
            );
        }

        for (let page = startPage; page <= endPage; page++) {
            items.push(
                <Pagination.Item
                    key={page}
                    active={page === pagination.currentPage}
                    onClick={() => handlePageChange(page)}
                >
                    {page}
                </Pagination.Item>
            );
        }

        if (pagination.currentPage < pagination.totalPages) {
            items.push(
                <Pagination.Next key="next" onClick={() => handlePageChange(pagination.currentPage + 1)} />
            );
        }

        return items;
    };

    return (
        <div className="orders-management">
            <h2 className="mb-4">Управление заказами</h2>

            <Card className="mb-4">
                <Card.Body>
                    <Row className="mb-3 align-items-end">
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Фильтр по статусу</Form.Label>
                                <Form.Select
                                    value={filter.status}
                                    onChange={handleFilterChange}
                                >
                                    <option value="all">Все заказы</option>
                                    <option value="pending">В обработке</option>
                                    <option value="processing">Обрабатывается</option>
                                    <option value="shipped">Отправлен</option>
                                    <option value="delivered">Доставлен</option>
                                    <option value="cancelled">Отменен</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={5}>
                            <Form onSubmit={handleSearch}>
                                <Form.Group>
                                    <Form.Label>Поиск</Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                            type="text"
                                            placeholder="Номер заказа, имя или email клиента"
                                            value={filter.search}
                                            onChange={handleSearchChange}
                                        />
                                        <Button type="submit" variant="outline-secondary">
                                            <FaSearch />
                                        </Button>
                                    </InputGroup>
                                </Form.Group>
                            </Form>
                        </Col>
                        <Col md={3}>
                            <div className="d-flex justify-content-end">
                                <span className="text-muted mt-2">
                                    Всего заказов: {pagination.totalItems}
                                </span>
                            </div>
                        </Col>
                    </Row>

                    {loading && (
                        <div className="text-center py-4">
                            <Spinner animation="border" variant="primary" />
                        </div>
                    )}

                    {error && (
                        <Alert variant="danger" className="mt-3">
                            {error}
                        </Alert>
                    )}

                    {!loading && !error && (
                        <>
                            <div className="table-responsive">
                                <Table className="admin-orders-table">
                                    <thead>
                                        <tr>
                                            <th>№ Заказа</th>
                                            <th>Дата</th>
                                            <th>Клиент</th>
                                            <th>Сумма</th>
                                            <th>Статус</th>
                                            <th>Действия</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.length > 0 ? (
                                            orders.map(order => (
                                                <tr key={order.id}>
                                                    <td>{order.order_number}</td>
                                                    <td>{new Date(order.created_at).toLocaleDateString('ru-RU')}</td>
                                                    <td>
                                                        <div>{order.customer_name}</div>
                                                        <small className="text-muted">{order.customer_email}</small>
                                                    </td>
                                                    <td>{parseFloat(order.total_amount).toLocaleString('ru-RU')} ₽</td>
                                                    <td>{getStatusBadge(order.status)}</td>
                                                    <td>
                                                        <div className="d-flex">
                                                            <Button
                                                                variant="outline-info"
                                                                size="sm"
                                                                className="me-2"
                                                                onClick={() => handleViewOrder(order.id)}
                                                                title="Просмотр"
                                                            >
                                                                <FaEye />
                                                            </Button>
                                                            <Dropdown>
                                                                <Dropdown.Toggle
                                                                    variant="outline-primary"
                                                                    size="sm"
                                                                    id={`dropdown-${order.id}`}
                                                                    title="Изменить статус"
                                                                >
                                                                    <FaEdit />
                                                                </Dropdown.Toggle>
                                                                <Dropdown.Menu>
                                                                    <Dropdown.Item
                                                                        onClick={() => handleStatusChange(order.id, 'pending')}
                                                                        active={order.status === 'pending'}
                                                                    >
                                                                        В обработке
                                                                    </Dropdown.Item>
                                                                    <Dropdown.Item
                                                                        onClick={() => handleStatusChange(order.id, 'processing')}
                                                                        active={order.status === 'processing'}
                                                                    >
                                                                        Обрабатывается
                                                                    </Dropdown.Item>
                                                                    <Dropdown.Item
                                                                        onClick={() => handleStatusChange(order.id, 'shipped')}
                                                                        active={order.status === 'shipped'}
                                                                    >
                                                                        Отправлен
                                                                    </Dropdown.Item>
                                                                    <Dropdown.Item
                                                                        onClick={() => handleStatusChange(order.id, 'delivered')}
                                                                        active={order.status === 'delivered'}
                                                                    >
                                                                        Доставлен
                                                                    </Dropdown.Item>
                                                                    <Dropdown.Divider />
                                                                    <Dropdown.Item
                                                                        onClick={() => handleStatusChange(order.id, 'cancelled')}
                                                                        active={order.status === 'cancelled'}
                                                                        className="text-danger"
                                                                    >
                                                                        Отменен
                                                                    </Dropdown.Item>
                                                                </Dropdown.Menu>
                                                            </Dropdown>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={6} className="text-center py-3">
                                                    Заказы не найдены
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </div>

                            {pagination.totalPages > 1 && (
                                <div className="d-flex justify-content-center mt-4">
                                    <Pagination>{getPaginationItems()}</Pagination>
                                </div>
                            )}
                        </>
                    )}
                </Card.Body>
            </Card>

            {/* Модальное окно просмотра заказа */}
            <Modal show={showOrderModal} onHide={() => setShowOrderModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        Заказ №{selectedOrder?.order_number}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedOrder && (
                        <>
                            <Row className="mb-4">
                                <Col md={6}>
                                    <h5 className="mb-3">Информация о заказе</h5>
                                    <p><strong>Дата:</strong> {new Date(selectedOrder.created_at).toLocaleString('ru-RU')}</p>
                                    <p>
                                        <strong>Статус:</strong> {' '}
                                        {getStatusBadge(selectedOrder.status)}
                                    </p>
                                    <p>
                                        <strong>Способ оплаты:</strong> {getPaymentMethodText(selectedOrder.payment_method)}
                                    </p>
                                    <p>
                                        <strong>Статус оплаты:</strong> {' '}
                                        {getPaymentStatusBadge(selectedOrder.payment_status)}
                                    </p>
                                    <p><strong>Сумма заказа:</strong> {parseFloat(selectedOrder.total_amount).toLocaleString('ru-RU')} ₽</p>
                                </Col>
                                <Col md={6}>
                                    <h5 className="mb-3">Данные клиента</h5>
                                    <p><strong>ФИО:</strong> {selectedOrder.customer_name}</p>
                                    <p><strong>Email:</strong> {selectedOrder.customer_email}</p>
                                    <p><strong>Телефон:</strong> {selectedOrder.customer_phone}</p>
                                    <p><strong>Адрес доставки:</strong> {selectedOrder.shipping_address}, {selectedOrder.shipping_city}{selectedOrder.shipping_postal_code ? `, ${selectedOrder.shipping_postal_code}` : ''}</p>
                                </Col>
                            </Row>

                            <h5 className="mb-3">Состав заказа</h5>
                            <div className="table-responsive">
                                <Table className="mb-0">
                                    <thead>
                                        <tr>
                                            <th>Товар</th>
                                            <th className="text-center">Количество</th>
                                            <th className="text-end">Цена</th>
                                            <th className="text-end">Сумма</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedOrder.orderItems?.map(item => (
                                            <tr key={item.id}>
                                                <td>{item.product.name}</td>
                                                <td className="text-center">{item.quantity}</td>
                                                <td className="text-end">{parseFloat(item.price).toLocaleString('ru-RU')} ₽</td>
                                                <td className="text-end">{(parseFloat(item.price) * item.quantity).toLocaleString('ru-RU')} ₽</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <th colSpan="3" className="text-end">Итого:</th>
                                            <th className="text-end">{parseFloat(selectedOrder.total_amount).toLocaleString('ru-RU')} ₽</th>
                                        </tr>
                                    </tfoot>
                                </Table>
                            </div>

                            {selectedOrder.notes && (
                                <div className="mt-4">
                                    <h5 className="mb-2">Комментарий к заказу</h5>
                                    <p className="p-3 bg-light rounded">{selectedOrder.notes}</p>
                                </div>
                            )}
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowOrderModal(false)}>
                        Закрыть
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Модальное окно изменения статуса */}
            <Modal show={showStatusModal} onHide={() => setShowStatusModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Изменение статуса заказа</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedOrder && (
                        <>
                            <p>
                                Вы уверены, что хотите изменить статус заказа №{selectedOrder.order_number} на{' '}
                                <strong>
                                    {newStatus === 'pending' && 'В обработке'}
                                    {newStatus === 'processing' && 'Обрабатывается'}
                                    {newStatus === 'shipped' && 'Отправлен'}
                                    {newStatus === 'delivered' && 'Доставлен'}
                                    {newStatus === 'cancelled' && 'Отменен'}
                                </strong>
                                ?
                            </p>
                            <p>Клиент получит уведомление об изменении статуса заказа.</p>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowStatusModal(false)} disabled={updatingStatus}>
                        Отмена
                    </Button>
                    <Button variant="primary" onClick={updateOrderStatus} disabled={updatingStatus}>
                        {updatingStatus ? 'Обновление...' : 'Обновить статус'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default OrdersManagement; 