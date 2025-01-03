import React, {useContext, useState} from 'react';
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {LOGIN_ROUTE, REGISTRATION_ROUTE, SHOP_ROUTE} from "../entities/utils/consts";
import { login, registration } from "../processes/userAPI";
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import '../app/styles/colors.scss';

const Auth = observer(() => {
    const { user } = useContext(Context);
    const location = useLocation();
    const navigate = useNavigate();
    const isLogin = location.pathname === LOGIN_ROUTE;
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const click = async () => {
        setLoading(true);
        let data;
        try {
            if (isLogin) {
                data = await login(email, password);
            } else {
                data = await registration(email, password);
            }

            user.setUser(data);
            user.setIsAuth(true);
            navigate(SHOP_ROUTE);
        } catch (e) {
            alert(e.response.data.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container
            className="d-flex justify-content-center align-items-center"
            style={{ height: window.innerHeight - 54 }}
        >
            <Card style={{ width: 600 }} className="p-5 m-text">
                <h2 className="m-auto">{isLogin ? 'Авторизация' : 'Регистрация'}</h2>
                <Form className="d-flex flex-column">
                    <Form.Control
                        className="mt-3 m-text"
                        placeholder="Введите ваш email..."
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <Form.Control
                        className="mt-3 m-text"
                        placeholder="Введите ваш пароль..."
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        type="password"
                    />
                    <Row className="d-flex justify-content-between align-items-center mt-3 pl-3 pr-3 m-text">
                        {isLogin ?
                            <Col xs="auto">
                                Нет аккаунта? <NavLink to={REGISTRATION_ROUTE}>Зарегистрируйтесь!</NavLink>
                            </Col>
                            :
                            <Col xs="auto">
                                Есть аккаунт? <NavLink to={LOGIN_ROUTE}>Войдите!</NavLink>
                            </Col>
                        }
                        <Col xs="auto">
                            <Button
                                variant="outline-success border-radius-0"
                                onClick={click}
                                disabled={loading}
                            >
                                {isLogin ? 'Войти' : 'Регистрация'}
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Card>
        </Container>
    );
});

export default Auth;
