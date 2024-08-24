import React from 'react';
import {Button, Card, Container, Form, Row} from "react-bootstrap";
import {NavLink} from "react-router-dom";
import {REGISTRATION_ROUTE} from "../utils/consts";

const Auth = () => {
    return (
        <Container
            className="d-flex justify-content-center align-items-center"
            style={{height: window.innerHeight - 54}}
        >
            <Card style={{width: 600}} className="p-5">
                <h2 className="m-auto">Авторизация</h2>
                <Form className="d-flex flex-column">
                    <Form.Control
                        className="mt-3"
                        placeholder="Введите ваш email..."
                    />
                    <Form.Control
                        className="mt-3"
                        placeholder="Введите ваш пароль..."
                    />
                    <Row className="d-flex justify-content-between pl-3 pr-3">
                        <div>
                            Нет аккаунта? <NavLink to={REGISTRATION_ROUTE}>Зарегестрируйся!</NavLink>
                        </div>
                        <Button
                            className="mt-3 align-self-end"
                            variant={"outline-success"}
                        >
                            Войти
                        </Button>
                    </Row>
                </Form>
            </Card>
        </Container>
    );
};

export default Auth;