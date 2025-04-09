import React, { useContext, useState, useEffect } from 'react';
import { Card, Container, Alert } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Context } from '../../../index';
import { LOGIN_ROUTE, SHOP_ROUTE } from '../../../shared/config/route-constants';
import { AuthForm, authApi } from '../../../features/auth';
import './AuthPage.scss';

const AuthPage = observer(() => {
    const { user } = useContext(Context);
    const location = useLocation();
    const navigate = useNavigate();
    const isLogin = location.pathname === LOGIN_ROUTE;
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState('');
    const [lastAttempt, setLastAttempt] = useState(0);

    useEffect(() => {
        if (user.isAuth) {
            navigate(SHOP_ROUTE);
        }
    }, [user.isAuth, navigate]);

    const handleSubmit = async (email, password) => {
        const now = Date.now();
        if (now - lastAttempt < 2000) {
            setServerError('Пожалуйста, подождите перед следующей попыткой');
            return;
        }
        setLastAttempt(now);
        setServerError('');
        
        setLoading(true);
        try {
            let data;
            if (isLogin) {
                data = await authApi.login(email, password);
            } else {
                data = await authApi.registration(email, password);
            }
            if (data) {
                user.setUser(data);
                user.setIsAuth(true);
            } else {
                setServerError('Ошибка авторизации: Нет данных от сервера');
            }
        } catch (e) {
            console.error('Auth error:', e);
            setServerError(e.response?.data?.message || 'Произошла ошибка при авторизации');
        } finally {
            setLoading(false);
        }
    };

    if (user.isAuth) {
        return null;
    }

    return (
        <Container
            className="d-flex justify-content-center align-items-center auth-container"
            style={{ height: window.innerHeight - 54 }}
        >
            <Card style={{ width: 600 }} className="p-5 m-text auth-card">
                <h2 className="m-auto">{isLogin ? 'Авторизация' : 'Регистрация'}</h2>
                <AuthForm 
                    isLogin={isLogin}
                    onSubmit={handleSubmit}
                    serverError={serverError}
                    loading={loading}
                />
            </Card>
        </Container>
    );
});

export default AuthPage; 