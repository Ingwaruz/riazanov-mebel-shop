import React, { useState, useContext } from 'react';
import { Navbar as BootstrapNavbar, Button, Row, Col, Image, Nav } from 'react-bootstrap';
import { Context } from "../../../index";
import { ADMIN_ROUTE, LOGIN_ROUTE, SHOP_ROUTE } from "../../../shared/config/route-constants";
import { observer } from "mobx-react-lite";
import { useNavigate, NavLink } from 'react-router-dom';
import { CenteredModal } from '../../modals';
import './Navbar.scss';

const Navbar = observer(() => {
    const { user } = useContext(Context);
    const { product } = useContext(Context);
    const navigate = useNavigate();

    const [modalData, setModalData] = useState({ show: false, title: '', content: '' });

    const logOut = () => {
        user.setUser({});
        user.setIsAuth(false);
        localStorage.removeItem('token');
        navigate(LOGIN_ROUTE);
    };

    const handleModalShow = (title, content) => {
        setModalData({ show: true, title, content });
    };

    const handleModalClose = () => {
        setModalData({ ...modalData, show: false });
    };

    return (
        <div>
            <BootstrapNavbar
                data-bs-theme="dark"
                style={{ height: 75, boxShadow: '0 4px 4px rgba(0, 0, 0, 0.4)' }}
                className={'s-text bg-main_color mb-4'}
            >
                <div className={'container-fluid'}>
                    <Col className="col-auto">
                        <NavLink
                            className={'s-text ps-3 color_white'}
                            to={SHOP_ROUTE}
                            onClick={() => product.resetFilters()} // Фильтры сбрасываются при переходе
                        >
                            <i className="fas fa-shop fa-2x"></i>
                        </NavLink>
                        <NavLink
                            className="ms-5 s-text color_white border-radius-0 hover-item--white border-color_white bg-main_color"
                            to={SHOP_ROUTE}
                            style={{border: 'none'}}
                        >
                            <i className="fas fa-user fa-2x"></i>
                        </NavLink>
                        <NavLink
                            className="ms-5 s-text color_white border-radius-0 hover-item--white border-color_white bg-main_color"
                            to={SHOP_ROUTE}
                            style={{border: 'none'}}
                        >
                            <i className="fas fa-cart-arrow-down fa-2x"></i>
                        </NavLink>
                    </Col>
                    <Row
                        className={'d-flex justify-content-around color_white flex-wrap'}
                        style={{ width: '100%', maxWidth: 900 }}
                    >

                    <Col className={'xs-text mx-3 col-auto'}>
                            <Button
                                variant="link"
                                className="color_white text-decoration-none m-text"
                                onClick={() =>
                                    handleModalShow(
                                        'Где купить',
                                        <>
                                            <p>
                                                <span style={{fontWeight: '600'}} className="l-text">Благовещенск</span>
                                                <br />
                                                    1. ТРЦ Острова, улица Мухина 144, 3 этаж <br />
                                            </p>
                                            <p>
                                                <span style={{fontWeight: '600'}} className="l-text">Хабаровск</span>
                                                <br/>
                                                    1. Улица Волочаевская 8д, 2 этаж<br />
                                                    2. Проспект 60-летия Октября 206, 3 этаж
                                            </p>
                                        </>
                                    )
                                }
                            >
                                ГДЕ КУПИТЬ
                            </Button>
                        </Col>
                        <Col className={'xs-text mx-3 col-auto'}>
                            <Button
                                variant="link"
                                className="color_white text-decoration-none m-text"
                                onClick={() =>
                                    handleModalShow(
                                        'Акции',
                                        'Информация о текущих акциях появится здесь.'
                                    )
                                }
                            >
                                АКЦИИ
                            </Button>
                        </Col>
                        <Col className={'xs-text mx-3 col-auto'}>
                            <Button
                                variant="link"
                                className="color_white text-decoration-none m-text"
                                onClick={() =>
                                    handleModalShow(
                                        'Доставка',
                                        'Информация о доставке появится здесь.'
                                    )
                                }
                            >
                                ДОСТАВКА
                            </Button>
                        </Col>
                        <Col className={'xs-text mx-3 col-auto'}>
                            <Button
                                variant="link"
                                className="color_white text-decoration-none m-text"
                                onClick={() =>
                                    handleModalShow(
                                        'Контакты',
                                        'Контактные номера:\n1. +7 (123) 456-78-90\n2. +7 (987) 654-32-10'
                                    )
                                }
                            >
                                КОНТАКТЫ
                            </Button>
                        </Col>
                    </Row>

                    {user.isAuth ? (
                        <Nav className="ml-auto color_white me-3">
                            {user.user.role === 'ADMIN' && (
                                <Button
                                    className="ms-lg-4 color_white border-radius-0 hover-item--white border-color_white bg-main_color m-text"
                                    onClick={() => navigate(ADMIN_ROUTE)}
                                >
                                    АДМИН ПАНЕЛЬ
                                </Button>
                            )}
                            <Button
                                className="ms-lg-4 s-text color_white border-radius-0 hover-item--white border-color_white bg-main_color"
                                onClick={logOut}
                                style={{border: 'none'}}
                            >
                                <i className="fas fa-arrow-right-from-bracket fa-2x"></i>
                            </Button>
                        </Nav>
                    ) : (
                        <Nav className="ml-auto">
                            <Button
                                className={'border-radius-0 hover-item--white color_white border-color_white bg-main_color m-text'}
                                onClick={() => navigate(LOGIN_ROUTE)}
                            >
                                ВОЙТИ
                            </Button>
                        </Nav>
                    )}
                </div>
            </BootstrapNavbar>

            {/* Модальное окно */}
            <CenteredModal
                show={modalData.show}
                onHide={handleModalClose}
                title={modalData.title}
            >
                <div style={{ whiteSpace: 'pre-line' }}>{modalData.content}</div>
            </CenteredModal>
        </div>
    );
});

export default Navbar; 