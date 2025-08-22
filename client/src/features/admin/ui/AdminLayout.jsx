import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import './AdminLayout.scss';

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const menuItems = [
        {
            title: 'Главная',
            icon: '📊',
            path: '/admin',
            exact: true
        },
        {
            title: 'Товары',
            icon: '📦',
            path: '/admin/products',
            submenu: [
                { title: 'Все товары', path: '/admin/products' },
                { title: 'Добавить товар', path: '/admin/products/new' },
                { title: 'Импорт товаров', path: '/admin/products/import' }
            ]
        },
        {
            title: 'Заказы',
            icon: '🛒',
            path: '/admin/orders',
            badge: 'new'
        },
        {
            title: 'Контакты',
            icon: '📞',
            path: '/admin/contacts'
        },
        {
            title: 'Страницы',
            icon: '📄',
            path: '/admin/content',
            submenu: [
                { title: 'О нас', path: '/admin/content/about' },
                { title: 'Доставка', path: '/admin/content/delivery' },
                { title: 'Все страницы', path: '/admin/content' }
            ]
        },
        {
            title: 'Настройки',
            icon: '⚙️',
            path: '/admin/settings',
            submenu: [
                { title: 'Типы товаров', path: '/admin/settings/types' },
                { title: 'Производители', path: '/admin/settings/factories' },
                { title: 'Коллекции', path: '/admin/settings/collections' },
                { title: 'Характеристики', path: '/admin/settings/features' }
            ]
        }
    ];

    const isActive = (path, exact = false) => {
        if (exact) {
            return location.pathname === path;
        }
        return location.pathname.startsWith(path);
    };

    const handleMenuClick = (item) => {
        if (item.submenu) {
            // Если есть подменю, переходим на первый пункт
            navigate(item.submenu[0].path);
        } else {
            navigate(item.path);
        }
    };

    return (
        <div className="admin-layout">
            <aside className={`admin-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
                <div className="admin-sidebar__header">
                    <h4 className="admin-sidebar__title">
                        {!sidebarCollapsed && 'Админ панель'}
                    </h4>
                    <button 
                        className="admin-sidebar__toggle"
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    >
                        {sidebarCollapsed ? '→' : '←'}
                    </button>
                </div>
                
                <nav className="admin-sidebar__nav">
                    {menuItems.map((item, index) => (
                        <div key={index} className="admin-sidebar__item-wrapper">
                            <div
                                className={`admin-sidebar__item ${isActive(item.path, item.exact) ? 'active' : ''}`}
                                onClick={() => handleMenuClick(item)}
                            >
                                <span className="admin-sidebar__icon">{item.icon}</span>
                                {!sidebarCollapsed && (
                                    <>
                                        <span className="admin-sidebar__text">{item.title}</span>
                                        {item.badge && (
                                            <span className="admin-sidebar__badge">{item.badge}</span>
                                        )}
                                    </>
                                )}
                            </div>
                            
                            {item.submenu && !sidebarCollapsed && isActive(item.path) && (
                                <div className="admin-sidebar__submenu">
                                    {item.submenu.map((subItem, subIndex) => (
                                        <div
                                            key={subIndex}
                                            className={`admin-sidebar__subitem ${isActive(subItem.path, true) ? 'active' : ''}`}
                                            onClick={() => navigate(subItem.path)}
                                        >
                                            {subItem.title}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </nav>
                
                <div className="admin-sidebar__footer">
                    <button 
                        className="admin-sidebar__logout"
                        onClick={() => navigate('/')}
                    >
                        {sidebarCollapsed ? '🚪' : '🚪 Выйти'}
                    </button>
                </div>
            </aside>
            
            <main className="admin-content">
                <Container fluid>
                    <Outlet />
                </Container>
            </main>
        </div>
    );
};

export default AdminLayout; 