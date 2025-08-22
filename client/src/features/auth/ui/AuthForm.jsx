import React, { useState, useContext } from 'react';
import { Button, Form, Row, Col, InputGroup, Alert, Spinner } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { LOGIN_ROUTE, REGISTRATION_ROUTE } from "../../../entities/utils/consts";
import { Context } from "../../../index";
import ButtonM2 from '../../../shared/ui/buttons/button-m2';

const AuthForm = ({ isLogin, onSubmit, serverError, loading }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({ email: '', password: '' });

    const validateEmail = (email) => {
        const validEmailDomains = ['@mail.ru', '@gmail.com', '@yandex.ru', '@outlook.com', '@yahoo.com'];
        const hasValidDomain = validEmailDomains.some(domain => email.endsWith(domain));
        if (!email) {
            return 'Email обязателен';
        }
        if (!hasValidDomain) {
            return 'Некорректный email домен';
        }
        return '';
    };

    const validatePassword = (password) => {
        if (!password) {
            return 'Пароль обязателен';
        }
        if (password.length < 8) {
            return 'Пароль должен содержать минимум 8 символов';
        }
        return '';
    };

    const handleSubmit = () => {
        const emailError = validateEmail(email);
        const passwordError = validatePassword(password);

        setErrors({
            email: emailError,
            password: passwordError
        });

        if (emailError || passwordError) {
            return;
        }

        onSubmit(email, password);
    };

    return (
        <Form className="d-flex flex-column" onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
        }}>
            {serverError && (
                <Alert variant="danger" className="mt-3">
                    {serverError}
                </Alert>
            )}
            <Form.Group className="mt-3">
                <Form.Control
                    className={`m-text ${errors.email ? 'is-invalid' : ''}`}
                    placeholder="Введите ваш email..."
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    disabled={loading}
                />
                {errors.email && (
                    <Form.Control.Feedback type="invalid">
                        {errors.email}
                    </Form.Control.Feedback>
                )}
            </Form.Group>
            <Form.Group className="mt-3">
                <InputGroup>
                    <Form.Control
                        className={`m-text ${errors.password ? 'is-invalid' : ''}`}
                        placeholder="Введите ваш пароль..."
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        type={showPassword ? "text" : "password"}
                        disabled={loading}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleSubmit();
                            }
                        }}
                    />
                    <Button
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ zIndex: 0 }}
                        className="border-main_color bg-main_color_hover hover-item--main_color"
                        disabled={loading}
                    >
                        {showPassword ? 
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill={showPassword ? "#FFFFFF" : "#36406D"} viewBox="0 0 16 16">
                                <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486z"/>
                                <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829"/>
                                <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708"/>
                            </svg>
                            :
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill={showPassword ? "#FFFFFF" : "#FFFFFF"} viewBox="0 0 16 16">
                                <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                                <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
                            </svg>
                        }
                    </Button>
                    {errors.password && (
                        <Form.Control.Feedback type="invalid">
                            {errors.password}
                        </Form.Control.Feedback>
                    )}
                </InputGroup>
                <div className="form-text text-muted mt-1">
                    Пароль должен содержать минимум 8 символов
                </div>
            </Form.Group>
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
                    <ButtonM2
                        onClick={handleSubmit}
                        disabled={loading}
                        text={loading ? 
                            <div className="d-flex align-items-center">
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                    className="me-2"
                                />
                                Загрузка...
                            </div> 
                            : 
                            isLogin ? 'Войти' : 'Регистрация'
                        }
                    />
                </Col>
            </Row>
        </Form>
    );
};

export default AuthForm; 