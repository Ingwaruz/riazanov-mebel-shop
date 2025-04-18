import React, {useContext, useState} from 'react';
import {Container, Dropdown, Nav, NavLink, Navbar, Offcanvas} from "react-bootstrap";
import {Link, useNavigate} from "react-router-dom";
import {Context} from "../../../index";
import {ADMIN_ROUTE, BASKET_ROUTE, LOGIN_ROUTE, SHOP_ROUTE} from "../../../shared/config/route-constants";
import {observer} from "mobx-react-lite";
import '../styles/Navbar.scss';
import '../../../app/styles/global-typography.scss';
import { CenteredModal } from '../../modals';

const NavbarComponent = observer(() => {
    const {user, basket} = useContext(Context);
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);
    const [modalData, setModalData] = useState({ show: false, title: '', content: '' });

    const handleClose = () => setShowMenu(false);
    const handleShow = () => setShowMenu(true);

    const handleModalShow = (title, content) => {
        setModalData({ show: true, title, content });
    };

    const handleModalClose = () => {
        setModalData({ ...modalData, show: false });
    };

    const logOut = () => {
        user.setUser({});
        user.setIsAuth(false);
        localStorage.removeItem('token');
    };

    // Модальное содержимое
    const deliveryContent = (
        <div>
            <h4>Условия доставки</h4>
            <p>Мы осуществляем доставку по всей России.</p>
            <ul>
                <li>Доставка по Москве - бесплатно (при заказе от 5000 руб)</li>
                <li>Доставка по Московской области - от 500 руб</li>
                <li>Доставка в регионы - по тарифам транспортных компаний</li>
            </ul>
            <p>Сроки доставки: 1-3 дня по Москве, 3-7 дней по России.</p>
            <p>Для уточнения деталей доставки, свяжитесь с нами по телефону: <a href="tel:+78001234567">8 (800) 123-45-67</a></p>
        </div>
    );

    const contactsContent = (
        <div>
            <h4>Наши контакты</h4>
            <p><strong>Адрес:</strong> г. Москва, ул. Мебельная, д. 123</p>
            <p><strong>Телефон:</strong> <a href="tel:+78001234567">8 (800) 123-45-67</a></p>
            <p><strong>Email:</strong> <a href="mailto:info@dommebel.ru">info@dommebel.ru</a></p>
            <p><strong>Режим работы:</strong></p>
            <p>Пн-Пт: 9:00 - 20:00<br />Сб-Вс: 10:00 - 18:00</p>
        </div>
    );

    const aboutContent = (
        <div>
            <h4>О нас</h4>
            <p>Компания "ДОМУ МЕБЕЛЬ" - это семейный бизнес с многолетней историей. Мы производим и продаем качественную мебель для дома и офиса с 2005 года.</p>
            <p>Наша миссия - создавать комфортное пространство для жизни и работы наших клиентов.</p>
            <p>Преимущества компании:</p>
            <ul>
                <li>Собственное производство</li>
                <li>Экологически чистые материалы</li>
                <li>Гарантия на всю продукцию</li>
                <li>Индивидуальный подход к каждому клиенту</li>
            </ul>
        </div>
    );

    return (
        <>
            <Navbar expand="lg" className="navBar" expanded={showMenu}>
                <Container fluid className="px-3 px-md-4">
                    {/* Логотип */}
                    <Navbar.Brand as={Link} to={SHOP_ROUTE} className="logo">
                        <div className="logo-text">
                            <span className="logo-text-first">ДОМУ</span>
                            <span className="logo-text-second">МЕБЕЛЬ</span>
                        </div>
                    </Navbar.Brand>
                    
                    {/* Навигационные ссылки для десктопа */}
                    <Nav className="d-none d-lg-flex justify-content-center flex-grow-1 gap-3">
                        <Nav.Link as={Link} to={SHOP_ROUTE}>Главная</Nav.Link>
                        <Nav.Link href="#catalogs">Каталог</Nav.Link>
                        <Nav.Link onClick={() => handleModalShow('О нас', aboutContent)}>О нас</Nav.Link>
                        <Nav.Link onClick={() => handleModalShow('Контакты', contactsContent)}>Контакты</Nav.Link>
                        <Nav.Link onClick={() => handleModalShow('Доставка', deliveryContent)}>Доставка</Nav.Link>
                    </Nav>
                    
                    {/* Иконки профиля и корзины */}
                    <div className="nav-icons d-flex align-items-center">
                        {user.isAuth ? (
                            <Dropdown>
                                <Dropdown.Toggle className="profile-dropdown">
                                    <i className="fas fa-user-circle icon-large"></i>
                                </Dropdown.Toggle>
                                <Dropdown.Menu align="end">
                                    {user.user.role === 'ADMIN' && (
                                        <Dropdown.Item onClick={() => navigate(ADMIN_ROUTE)}>
                                            Панель администратора
                                        </Dropdown.Item>
                                    )}
                                    <Dropdown.Item onClick={logOut}>
                                        Выйти
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        ) : (
                            <NavLink
                                as={Link}
                                to={LOGIN_ROUTE}
                                className="auth-link"
                            >
                                <i className="fas fa-user-circle icon-large"></i>
                                <span className="d-none d-md-inline ms-1">Войти</span>
                            </NavLink>
                        )}
                        <NavLink
                            as={Link}
                            to={BASKET_ROUTE}
                            className="basket-link"
                        >
                            <i className="fas fa-shopping-cart icon-large"></i>
                            <span className="d-none d-md-inline ms-1">Корзина</span>
                            {basket.totalItems > 0 && (
                                <span className="basket-badge">{basket.totalItems}</span>
                            )}
                        </NavLink>
                        
                        {/* Кнопка-гамбургер - показывается только на маленьких экранах */}
                        <Navbar.Toggle aria-controls="navbar-nav" className="d-lg-none" onClick={handleShow}>
                            <i className="fas fa-bars icon-large"></i>
                        </Navbar.Toggle>
                    </div>

                    {/* Мобильное меню */}
                    <Navbar.Offcanvas
                        id="navbar-nav"
                        aria-labelledby="offcanvasNavbarLabel"
                        placement="end"
                        show={showMenu}
                        onHide={handleClose}
                        className="d-lg-none"
                    >
                        <Offcanvas.Header closeButton>
                            <Offcanvas.Title id="offcanvasNavbarLabel">Меню</Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
                            <Nav className="justify-content-end flex-grow-1 pe-3">
                                <Nav.Link as={Link} to={SHOP_ROUTE} onClick={handleClose}>Главная</Nav.Link>
                                <Nav.Link href="#catalogs" onClick={handleClose}>Каталог</Nav.Link>
                                <Nav.Link onClick={() => {handleModalShow('О нас', aboutContent); handleClose();}}>О нас</Nav.Link>
                                <Nav.Link onClick={() => {handleModalShow('Контакты', contactsContent); handleClose();}}>Контакты</Nav.Link>
                                <Nav.Link onClick={() => {handleModalShow('Доставка', deliveryContent); handleClose();}}>Доставка</Nav.Link>
                            </Nav>
                        </Offcanvas.Body>
                    </Navbar.Offcanvas>
                </Container>
            </Navbar>

            <CenteredModal
                show={modalData.show}
                onHide={handleModalClose}
                title={modalData.title}
            >
                {modalData.content}
            </CenteredModal>
        </>
    );
});

export default NavbarComponent; 