import React, { useState } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { FormField } from '../../../shared/ui/forms';
import './CheckoutForm.scss';

const CheckoutForm = ({ onSubmit, loading = false, totalPrice }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
        personalDataConsent: false
    });
    
    const [errors, setErrors] = useState({});
    
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: type === 'checkbox' ? checked : value 
        }));
        
        // Очищаем ошибку при изменении поля
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };
    
    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.firstName.trim()) {
            newErrors.firstName = 'Имя обязательно';
        }
        
        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Фамилия обязательна';
        }
        
        if (!formData.email.trim()) {
            newErrors.email = 'Email обязателен';
        } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
            newErrors.email = 'Некорректный email';
        }
        
        if (!formData.phone.trim()) {
            newErrors.phone = 'Телефон обязателен';
        } else if (!/^\+?[0-9\s\-()]{10,}$/.test(formData.phone)) {
            newErrors.phone = 'Некорректный номер телефона';
        }
        
        if (!formData.address.trim()) {
            newErrors.address = 'Адрес обязателен';
        }
        
        if (!formData.city.trim()) {
            newErrors.city = 'Город обязателен';
        }
        
        if (!formData.personalDataConsent) {
            newErrors.personalDataConsent = 'Необходимо согласие на обработку персональных данных';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            onSubmit(formData);
        }
    };
    
    return (
        <Form className="checkout-form" onSubmit={handleSubmit}>
            <h4 className="mb-4">Информация для доставки</h4>
            
            <Row>
                <Col md={6}>
                    <FormField
                        label="Имя"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        error={errors.firstName}
                        required
                        disabled={loading}
                    />
                </Col>
                <Col md={6}>
                    <FormField
                        label="Фамилия"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        error={errors.lastName}
                        required
                        disabled={loading}
                    />
                </Col>
            </Row>
            
            <Row>
                <Col md={6}>
                    <FormField
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                        required
                        disabled={loading}
                    />
                </Col>
                <Col md={6}>
                    <FormField
                        label="Телефон"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        error={errors.phone}
                        required
                        disabled={loading}
                        placeholder="+7 (___) ___-__-__"
                    />
                </Col>
            </Row>
            
            <FormField
                label="Адрес"
                name="address"
                value={formData.address}
                onChange={handleChange}
                error={errors.address}
                required
                disabled={loading}
            />
            
            <Row>
                <Col md={6}>
                    <FormField
                        label="Город"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        error={errors.city}
                        required
                        disabled={loading}
                    />
                </Col>
                <Col md={6}>
                    <FormField
                        label="Почтовый индекс"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        error={errors.postalCode}
                        disabled={loading}
                    />
                </Col>
            </Row>
            
            {totalPrice && (
                <div className="order-total mt-4 mb-4">
                    <h4 className="mb-3">Сумма заказа</h4>
                    <div className="fw-bold fs-5">{totalPrice.toLocaleString('ru-RU')} ₽</div>
                </div>
            )}
            
            <div className="mb-4">
                <Form.Check
                    type="checkbox"
                    id="personal-data-consent"
                    label="Я согласен на обработку персональных данных"
                    name="personalDataConsent"
                    checked={formData.personalDataConsent}
                    onChange={handleChange}
                    isInvalid={!!errors.personalDataConsent}
                    disabled={loading}
                />
                {errors.personalDataConsent && (
                    <Form.Control.Feedback type="invalid" className="d-block">
                        {errors.personalDataConsent}
                    </Form.Control.Feedback>
                )}
            </div>
            
            <Button 
                type="submit" 
                variant="primary" 
                className="submit-button" 
                disabled={loading || !formData.personalDataConsent}
            >
                {loading ? 'Оформление заказа...' : 'Оформить заказ'}
            </Button>
        </Form>
    );
};

export default CheckoutForm; 