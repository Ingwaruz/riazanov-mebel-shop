import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Breadcrumb, Card, Alert, Spinner, Table, Badge, Pagination, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { checkoutApi } from '../../../features/checkout';
import { SHOP_ROUTE } from '../../../shared/config/route-constants';
import './OrdersPage.scss';

const OrdersPage = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0
    });
    const [filter, setFilter] = useState('all');

    const fetchOrders = async (page = 1, status = null) => {
        try {
            setLoading(true);
            const params = { page, limit: 10 };
            if (status && status !== 'all') {
                params.status = status;
            }

            const data = await checkoutApi.getUserOrders(params);
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
        fetchOrders(1, filter !== 'all' ? filter : null);
    }, [filter]);

    const handlePageChange = (page) => {
        fetchOrders(page, filter !== 'all' ? filter : null);
    };

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
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

    const handleOrderClick = (orderId) => {
        navigate(`/order/${orderId}`);
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
        <Container fluid className="orders-page py-4">
            <Row className="justify-content-center">
                <Col xs={12} lg={10}>
                    <Breadcrumb className="mb-4">
                        <Breadcrumb.Item linkAs={Link} linkProps={{ to: SHOP_ROUTE }}>
                            Главная
                        </Breadcrumb.Item>
                        <Breadcrumb.Item active>Мои заказы</Breadcrumb.Item>
                    </Breadcrumb>

                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h1>Мои заказы</h1>

                        <Form.Group>
                            <Form.Select 
                                value={filter} 
                                onChange={handleFilterChange}
                                className="status-filter"
                            >
                                <option value="all">Все заказы</option>
                                <option value="pending">В обработке</option>
                                <option value="processing">Обрабатывается</option>
                                <option value="shipped">Отправлен</option>
                                <option value="delivered">Доставлен</option>
                                <option value="cancelled">Отменен</option>
                            </Form.Select>
                        </Form.Group>
                    </div>

                    {loading ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" variant="primary" />
                            <p className="mt-3">Загрузка заказов...</p>
                        </div>
                    ) : error ? (
                        <Alert variant="danger">
                            {error}
                        </Alert>
                    ) : orders.length > 0 ? (
                        <>
                            <Card className="orders-card mb-4">
                                <Card.Body className="p-0">
                                    <div className="table-responsive">
                                        <Table className="orders-table mb-0">
                                            <thead>
                                                <tr>
                                                    <th>№ заказа</th>
                                                    <th>Дата</th>
                                                    <th>Сумма</th>
                                                    <th>Статус</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {orders.map(order => (
                                                    <tr 
                                                        key={order.id} 
                                                        className="order-row"
                                                        onClick={() => handleOrderClick(order.id)}
                                                    >
                                                        <td>{order.order_number}</td>
                                                        <td>{new Date(order.created_at).toLocaleDateString('ru-RU')}</td>
                                                        <td>{parseFloat(order.total_amount).toLocaleString('ru-RU')} ₽</td>
                                                        <td>{getStatusBadge(order.status)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </div>
                                </Card.Body>
                            </Card>

                            {pagination.totalPages > 1 && (
                                <div className="d-flex justify-content-center">
                                    <Pagination>{getPaginationItems()}</Pagination>
                                </div>
                            )}
                        </>
                    ) : (
                        <Alert variant="info">
                            У вас пока нет заказов.
                            <Link to={SHOP_ROUTE} className="ms-2">Перейти к покупкам</Link>
                        </Alert>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default OrdersPage; 