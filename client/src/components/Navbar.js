import React, { useContext } from 'react';
import {Navbar as BootstrapNavbar, Container, Nav, Button, Row, Col, Image} from 'react-bootstrap';
import { Context } from "../index";
import {ADMIN_ROUTE, LOGIN_ROUTE, PRODUCT_ROUTE, REGISTRATION_ROUTE, SHOP_ROUTE} from "../utils/consts";
import { NavLink } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useNavigate } from 'react-router-dom'

const MyNavbar = observer(() => {
    const { user } = useContext(Context);
    const navigate = useNavigate()
    const { product } = useContext(Context);


    const logOut = () => {
        user.setUser({})
        user.setIsAuth(false)
        localStorage.removeItem('token')
        navigate(LOGIN_ROUTE);
    }

    return (
        <div>
            <BootstrapNavbar data-bs-theme="dark" style={{height: 75, boxShadow: '0 4px 4px rgba(0, 0, 0, 0.4)'}} className={'s-text bg-color-gray'}>
                <div className={'container-fluid'}>
                    <NavLink className={'s-text ps-3 color-white'} to={SHOP_ROUTE}>
                        <Image
                            className="icon"
                            width={50}
                            onClick={() => { product.resetFilters() }}
                            src="/icons/riazanov-mebel.jpg"
                        />
                    </NavLink>
                    <Row className={'d-flex justify-content-around color-white'} style={{ width: 600 }}>
                        <Col className={'xs-text mx-3'}>
                            <NavLink
                                className={'color-white'}
                                to={SHOP_ROUTE}
                            >
                                ГДЕ КУПИТЬ
                            </NavLink>
                        </Col>
                        <Col className={'xs-text mx-3'}>
                            <NavLink
                                className={'color-white'}
                                to={SHOP_ROUTE}
                            >
                                РАСПРОДАЖА
                            </NavLink>
                        </Col>
                        <Col className={'xs-text mx-3'}>
                            <NavLink
                                className={'color-white'}
                                to={SHOP_ROUTE}
                            >
                                ДОСТАВКА
                            </NavLink>
                        </Col>
                        <Col className={'xs-text mx-3'}>
                            <NavLink
                                className={'color-white'}
                                to={SHOP_ROUTE}
                            >
                                КОНТАКТЫ
                            </NavLink>
                        </Col>
                    </Row>

                    {user.isAuth ?
                        <Nav className="ml-auto color-white">
                            <Button
                                className="ms-lg-4 s-text color-white border-radius-0 hover-item--white border-color-white bg-color-gray"
                                onClick={() => navigate(ADMIN_ROUTE)}>
                                Админ панель
                            </Button>
                            <Button
                                className="ms-lg-4 s-text color-white border-radius-0 hover-item--white border-color-white bg-color-gray"
                                onClick={() => logOut()}>
                                Выйти
                            </Button>
                        </Nav>
                        :
                        <Nav className="ml-auto">
                            <Button
                                className={'border-radius-0 s-text hover-item--white color-white border-color-white bg-color-gray'}
                                onClick={() => navigate(LOGIN_ROUTE)}>
                                Авторизация
                            </Button>
                        </Nav>
                    }
                </div>
            </BootstrapNavbar>
        </div>
    );
});

export default MyNavbar;
