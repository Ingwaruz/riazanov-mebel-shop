import React, { useContext } from 'react';
import {Navbar as BootstrapNavbar, Container, Nav, Button, Row, Col} from 'react-bootstrap';
import { Context } from "../index";
import {ADMIN_ROUTE, LOGIN_ROUTE, PRODUCT_ROUTE, REGISTRATION_ROUTE, SHOP_ROUTE} from "../utils/consts";
import { NavLink } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useNavigate } from 'react-router-dom'

const MyNavbar = observer(() => {
    const { user } = useContext(Context);
    const navigate = useNavigate()

    const logOut = () => {
        user.setUser({})
        user.setIsAuth(false)
        localStorage.removeItem('token')
        navigate(LOGIN_ROUTE);
    }

    return (
        <div>
            <BootstrapNavbar data-bs-theme="dark" style={{height: 75}} className={'s-text bg-color-gray'}>
                <Container>
                    <NavLink className={'s-text ps-3 color-white'} to={SHOP_ROUTE}>
                        Тут будет логотип
                    </NavLink>
                    <Row className={'d-flex color-white'} style={{width: 500}}>
                        <Col className={'s-text'}>
                            <NavLink
                                className={'color-white'}
                                to={SHOP_ROUTE}
                            >
                                Где купить
                            </NavLink>
                        </Col>
                        <Col className={'s-text color-white'}>
                            Нигде бля
                        </Col>
                        <Col className={'s-text'}>
                            <NavLink
                                className={'color-white'}
                                to={SHOP_ROUTE}
                            >
                                Контакты
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
                </Container>
            </BootstrapNavbar>
        </div>
    );
});

export default MyNavbar;
