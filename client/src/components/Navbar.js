import React, { useContext } from 'react';
import { Navbar as BootstrapNavbar, Container, Nav, Button } from 'react-bootstrap';
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
            <BootstrapNavbar bg="dark" data-bs-theme="dark">
                <Container>
                    <NavLink style={{ color: 'white' }} to={SHOP_ROUTE}>КупиДиван</NavLink>
                    {user.isAuth ?
                        <Nav className="ml-auto" style={{ color: 'white' }}>
                            <Button
                                variant={"outline-light"}
                                onClick={() => navigate(ADMIN_ROUTE)}>
                                Админ панель
                            </Button>
                            <Button
                                variant={"outline-light"}
                                className="ms-lg-4"
                                onClick={() => logOut()}>
                                Выйти
                            </Button>
                        </Nav>
                        :
                        <Nav className="ml-auto" style={{ color: 'white' }}>
                            <Button variant={"outline-light"} onClick={() => navigate(LOGIN_ROUTE)}>Авторизация</Button>
                        </Nav>
                    }
                </Container>
            </BootstrapNavbar>
        </div>
    );
});

export default MyNavbar;
