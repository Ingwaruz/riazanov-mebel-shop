import React, { useContext, useState, useEffect } from 'react';
import { Card, Container, Alert } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { AnimatePresence } from 'framer-motion';
import { Context } from '../../../index';
import { LOGIN_ROUTE, SHOP_ROUTE } from '../../../shared/config/route-constants';
import { AuthForm, authApi } from '../../../features/auth';
import PinVerificationForm from '../../../features/auth/ui/PinVerificationForm';
import RegistrationProgress from '../../../features/auth/ui/RegistrationProgress';
import './AuthPage.scss';

const AuthPage = observer(() => {
    const { user } = useContext(Context);
    const location = useLocation();
    const navigate = useNavigate();
    const isLogin = location.pathname === LOGIN_ROUTE;
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState('');
    const [lastAttempt, setLastAttempt] = useState(0);
    
    // Состояния для двухэтапной регистрации
    const [registrationStep, setRegistrationStep] = useState('form'); // 'form', 'pin', 'complete'
    const [userEmail, setUserEmail] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [emailVerified, setEmailVerified] = useState(false);
    const [devPinCode, setDevPinCode] = useState('');

    useEffect(() => {
        if (user.isAuth) {
            navigate(SHOP_ROUTE);
        }
    }, [user.isAuth, navigate]);

    // Отправка пин-кода на email
    const handleSendPin = async (email, password) => {
        setLoading(true);
        setServerError('');
        try {
            // Сохраняем данные для последующей регистрации
            setUserEmail(email);
            setUserPassword(password);
            
            // Отправляем пин-код
            const response = await authApi.sendVerificationPin(email);
            setRegistrationStep('pin');
            
            // Сохраняем пин-код из режима разработки, если он доступен
            if (response && response.dev_pin_code) {
                // Сохраняем для передачи в PinVerificationForm
                setDevPinCode(response.dev_pin_code);
            }
        } catch (e) {
            console.error('Send pin error:', e);
            setServerError(e.response?.data?.message || 'Ошибка при отправке пин-кода');
        } finally {
            setLoading(false);
        }
    };

    // Проверка пин-кода
    const handleVerifyPin = async (pinCode) => {
        try {
            const result = await authApi.verifyPin(userEmail, pinCode);
            if (result.verified) {
                setEmailVerified(true);
                // Выполняем регистрацию
                await handleRegistration();
            }
        } catch (e) {
            throw new Error(e.response?.data?.message || 'Неверный пин-код');
        }
    };

    // Финальная регистрация после верификации
    const handleRegistration = async () => {
        setLoading(true);
        try {
            const data = await authApi.registration(userEmail, userPassword, true);
            if (data) {
                user.setUser(data);
                user.setIsAuth(true);
                setRegistrationStep('complete');
            }
        } catch (e) {
            console.error('Registration error:', e);
            setServerError(e.response?.data?.message || 'Ошибка при регистрации');
            setRegistrationStep('form');
        } finally {
            setLoading(false);
        }
    };

    // Обработка отправки формы
    const handleSubmit = async (email, password) => {
        const now = Date.now();
        if (now - lastAttempt < 2000) {
            setServerError('Пожалуйста, подождите перед следующей попыткой');
            return;
        }
        setLastAttempt(now);
        setServerError('');
        
        if (isLogin) {
            // Логин без верификации
            setLoading(true);
            try {
                const data = await authApi.login(email, password);
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
        } else {
            // Начинаем процесс регистрации с отправки пин-кода
            await handleSendPin(email, password);
        }
    };

    // Повторная отправка пин-кода
    const handleResendPin = async () => {
        try {
            const response = await authApi.sendVerificationPin(userEmail);
            // Сохраняем пин-код из режима разработки, если он доступен
            if (response && response.dev_pin_code) {
                setDevPinCode(response.dev_pin_code);
            }
        } catch (e) {
            setServerError(e.response?.data?.message || 'Ошибка при отправке пин-кода');
        }
    };

    // Возврат к форме
    const handleBackToForm = () => {
        setRegistrationStep('form');
        setServerError('');
        setEmailVerified(false);
    };

    if (user.isAuth) {
        return null;
    }

    return (
        <Container
            className="d-flex justify-content-center align-items-center auth-container"
        >
            <Card style={{ width: 600 }} className="p-5 m-text auth-card">
                {!isLogin && registrationStep !== 'form' && (
                    <RegistrationProgress currentStep={registrationStep} />
                )}
                
                <AnimatePresence mode="wait">
                    {registrationStep === 'form' && (
                        <>
                            <h2 className="m-auto mb-4">{isLogin ? 'Авторизация' : 'Регистрация'}</h2>
                            <AuthForm 
                                isLogin={isLogin}
                                onSubmit={handleSubmit}
                                serverError={serverError}
                                loading={loading}
                            />
                        </>
                    )}
                    
                    {registrationStep === 'pin' && !isLogin && (
                        <PinVerificationForm
                            email={userEmail}
                            onVerify={handleVerifyPin}
                            onResend={handleResendPin}
                            onBack={handleBackToForm}
                            devPinCode={devPinCode}
                        />
                    )}
                </AnimatePresence>
            </Card>
        </Container>
    );
});

export default AuthPage; 