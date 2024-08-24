import React, { useContext } from 'react';
import { Navbar as BootstrapNavbar, Container, Nav, Button } from 'react-bootstrap';
import { Context } from "../index";
import { SHOP_ROUTE } from "../utils/consts";
import { NavLink } from "react-router-dom";
import { observer } from "mobx-react-lite";

const MyNavbar = observer(() => {
    const { user } = useContext(Context);

    return (
        <div>
            <BootstrapNavbar bg="dark" data-bs-theme="dark">
                <Container>
                    <NavLink style={{ color: 'white' }} to={SHOP_ROUTE}>КупиДиван</NavLink>
                    {user.isAuth ?
                        <Nav className="ml-auto" style={{ color: 'white' }}>
                            <Button variant={"outline-light"}>Админ панель</Button>
                            <Button variant={"outline-light"} className="ms-lg-4">Выйти</Button>
                        </Nav>
                        :
                        <Nav className="ml-auto" style={{ color: 'white' }}>
                            <Button variant={"outline-light"} onClick={() => user.setIsAuth(true)}>Авторизация</Button>
                        </Nav>
                    }
                </Container>
            </BootstrapNavbar>
        </div>
    );
});

export default MyNavbar;
