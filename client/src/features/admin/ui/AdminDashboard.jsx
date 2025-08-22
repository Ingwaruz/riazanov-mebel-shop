import React, { useState, useEffect } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import './AdminDashboard.scss';

// Регистрация компонентов Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalOrders: 156,
        todayOrders: 12,
        totalRevenue: 3456789,
        todayRevenue: 234567,
        totalProducts: 892,
        activeProducts: 756,
        totalUsers: 1234,
        newUsers: 45
    });

    const [loading, setLoading] = useState(false);

    // Данные для графика продаж за последние 7 дней
    const salesChartData = {
        labels: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
        datasets: [
            {
                label: 'Продажи',
                data: [120000, 150000, 180000, 165000, 190000, 220000, 195000],
                borderColor: '#4777E2',
                backgroundColor: 'rgba(71, 119, 226, 0.1)',
                tension: 0.4
            }
        ]
    };

    // Данные для графика популярных категорий
    const categoriesChartData = {
        labels: ['Диваны', 'Кресла', 'Столы', 'Шкафы', 'Кровати'],
        datasets: [
            {
                label: 'Количество заказов',
                data: [45, 32, 28, 25, 20],
                backgroundColor: [
                    '#36406D',
                    '#5262A6',
                    '#424F86',
                    '#4777E2',
                    '#FED953'
                ]
            }
        ]
    };

    // Данные для графика статусов заказов
    const ordersStatusData = {
        labels: ['Новые', 'В обработке', 'Доставляются', 'Выполнены'],
        datasets: [
            {
                data: [25, 15, 8, 108],
                backgroundColor: [
                    '#FED953',
                    '#4777E2',
                    '#5262A6',
                    '#36406D'
                ]
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom'
            }
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'RUB',
            minimumFractionDigits: 0
        }).format(value);
    };

    const StatCard = ({ title, value, subtitle, icon, color = 'primary' }) => (
        <Card className={`stat-card stat-card--${color}`}>
            <Card.Body>
                <div className="stat-card__header">
                    <span className="stat-card__icon">{icon}</span>
                    <h6 className="stat-card__title">{title}</h6>
                </div>
                <div className="stat-card__value">{value}</div>
                {subtitle && <div className="stat-card__subtitle">{subtitle}</div>}
            </Card.Body>
        </Card>
    );

    return (
        <div className="admin-dashboard">
            <div className="admin-dashboard__header">
                <h1>Панель управления</h1>
                <p className="text-muted">Добро пожаловать в админ-панель Рязанов Мебель</p>
            </div>

            {/* Статистика */}
            <Row className="mb-4">
                <Col xs={12} sm={6} lg={3} className="mb-3">
                    <StatCard
                        title="Заказы"
                        value={stats.totalOrders}
                        subtitle={`+${stats.todayOrders} сегодня`}
                        icon="🛒"
                        color="primary"
                    />
                </Col>
                <Col xs={12} sm={6} lg={3} className="mb-3">
                    <StatCard
                        title="Выручка"
                        value={formatCurrency(stats.totalRevenue)}
                        subtitle={`+${formatCurrency(stats.todayRevenue)} сегодня`}
                        icon="💰"
                        color="success"
                    />
                </Col>
                <Col xs={12} sm={6} lg={3} className="mb-3">
                    <StatCard
                        title="Товары"
                        value={stats.totalProducts}
                        subtitle={`${stats.activeProducts} активных`}
                        icon="📦"
                        color="info"
                    />
                </Col>
                <Col xs={12} sm={6} lg={3} className="mb-3">
                    <StatCard
                        title="Клиенты"
                        value={stats.totalUsers}
                        subtitle={`+${stats.newUsers} новых`}
                        icon="👥"
                        color="warning"
                    />
                </Col>
            </Row>

            {/* Графики */}
            <Row className="mb-4">
                <Col lg={8} className="mb-4">
                    <Card className="chart-card">
                        <Card.Header>
                            <h5 className="mb-0">Продажи за последние 7 дней</h5>
                        </Card.Header>
                        <Card.Body>
                            <div style={{ height: '300px' }}>
                                <Line data={salesChartData} options={chartOptions} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={4} className="mb-4">
                    <Card className="chart-card">
                        <Card.Header>
                            <h5 className="mb-0">Статусы заказов</h5>
                        </Card.Header>
                        <Card.Body>
                            <div style={{ height: '300px' }}>
                                <Doughnut data={ordersStatusData} options={chartOptions} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Популярные категории */}
            <Row className="mb-4">
                <Col lg={6} className="mb-4">
                    <Card className="chart-card">
                        <Card.Header>
                            <h5 className="mb-0">Популярные категории</h5>
                        </Card.Header>
                        <Card.Body>
                            <div style={{ height: '250px' }}>
                                <Bar data={categoriesChartData} options={chartOptions} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={6} className="mb-4">
                    <Card>
                        <Card.Header>
                            <h5 className="mb-0">Последние заказы</h5>
                        </Card.Header>
                        <Card.Body>
                            <div className="recent-orders">
                                <div className="recent-order-item">
                                    <div className="recent-order-item__info">
                                        <div className="recent-order-item__id">#1234</div>
                                        <div className="recent-order-item__customer">Иван Иванов</div>
                                    </div>
                                    <div className="recent-order-item__amount">{formatCurrency(45000)}</div>
                                    <div className="recent-order-item__status status--new">Новый</div>
                                </div>
                                <div className="recent-order-item">
                                    <div className="recent-order-item__info">
                                        <div className="recent-order-item__id">#1233</div>
                                        <div className="recent-order-item__customer">Петр Петров</div>
                                    </div>
                                    <div className="recent-order-item__amount">{formatCurrency(78000)}</div>
                                    <div className="recent-order-item__status status--processing">В обработке</div>
                                </div>
                                <div className="recent-order-item">
                                    <div className="recent-order-item__info">
                                        <div className="recent-order-item__id">#1232</div>
                                        <div className="recent-order-item__customer">Анна Сидорова</div>
                                    </div>
                                    <div className="recent-order-item__amount">{formatCurrency(32000)}</div>
                                    <div className="recent-order-item__status status--completed">Выполнен</div>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Быстрые действия */}
            <Row>
                <Col>
                    <Card>
                        <Card.Header>
                            <h5 className="mb-0">Быстрые действия</h5>
                        </Card.Header>
                        <Card.Body>
                            <div className="quick-actions">
                                <button className="quick-action-btn">
                                    <span className="quick-action-btn__icon">➕</span>
                                    <span>Добавить товар</span>
                                </button>
                                <button className="quick-action-btn">
                                    <span className="quick-action-btn__icon">📝</span>
                                    <span>Создать заказ</span>
                                </button>
                                <button className="quick-action-btn">
                                    <span className="quick-action-btn__icon">📧</span>
                                    <span>Рассылка</span>
                                </button>
                                <button className="quick-action-btn">
                                    <span className="quick-action-btn__icon">📊</span>
                                    <span>Отчеты</span>
                                </button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default AdminDashboard; 