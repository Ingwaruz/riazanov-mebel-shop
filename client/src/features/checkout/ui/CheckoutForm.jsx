import React, { useState, useContext } from 'react';
import { Form, Row, Col, Button, Card, Table } from 'react-bootstrap';
import { FormField } from '../../../shared/ui/forms';
import { checkoutApi } from '..';
import { Context } from '../../../index';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import './CheckoutForm.scss';

const CheckoutForm = observer(({ onSuccess, loading = false }) => {
    const { basket } = useContext(Context);
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [localLoading, setLocalLoading] = useState(loading);
    
    const [formData, setFormData] = useState({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        shipping_address: '',
        shipping_city: '',
        shipping_postal_code: '',
        payment_method: 'cash',
        notes: '',
        personal_data_consent: false
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
        
        if (!formData.customer_name.trim()) {
            newErrors.customer_name = 'ФИО обязательно';
        }
        
        if (!formData.customer_email.trim()) {
            newErrors.customer_email = 'Email обязателен';
        } else if (!/^\S+@\S+\.\S+$/.test(formData.customer_email)) {
            newErrors.customer_email = 'Некорректный email';
        }
        
        if (!formData.customer_phone.trim()) {
            newErrors.customer_phone = 'Телефон обязателен';
        } else if (!/^\+?[0-9\s\-()]{10,}$/.test(formData.customer_phone)) {
            newErrors.customer_phone = 'Некорректный номер телефона';
        }
        
        if (!formData.shipping_address.trim()) {
            newErrors.shipping_address = 'Адрес обязателен';
        }
        
        if (!formData.shipping_city.trim()) {
            newErrors.shipping_city = 'Город обязателен';
        }
        
        if (!formData.payment_method) {
            newErrors.payment_method = 'Выберите способ оплаты';
        }
        
        if (!formData.personal_data_consent) {
            newErrors.personal_data_consent = 'Необходимо согласие на обработку персональных данных';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        if (basket.items.length === 0) {
            setError('Корзина пуста');
            return;
        }
        
        setLocalLoading(true);
        setError(null);
        
        try {
            // Формируем данные заказа
            const orderData = {
                ...formData,
                items: basket.items.map(item => ({
                    product_id: item.id,
                    quantity: item.quantity
                }))
            };
            
            // Отправляем заказ
            const response = await checkoutApi.createOrder(orderData);
            
            // Очищаем корзину
            basket.clearBasket();
            
            // Вызываем коллбэк успеха, если он передан
            if (onSuccess) {
                onSuccess(response);
            }
            
            // Редирект на страницу подтверждения заказа
            navigate(`/order-confirmation/${response.id}`);
        } catch (err) {
            console.error('Ошибка при оформлении заказа:', err);
            setError(err.response?.data?.message || 'Произошла ошибка при оформлении заказа');
        } finally {
            setLocalLoading(false);
        }
    };
    
    const isLoading = submitting || localLoading || loading;
    
    return (
        <Form className="checkout-form" onSubmit={handleSubmit}>
            {error && (
                <div className="alert alert-danger mb-4">{error}</div>
            )}
            
            <Row>
                <Col md={7}>
                    <h4 className="mb-4">Информация для доставки</h4>
                    
                    <FormField
                        label="ФИО"
                        name="customer_name"
                        value={formData.customer_name}
                        onChange={handleChange}
                        error={errors.customer_name}
                        required
                        disabled={isLoading}
                    />
                    
                    <Row>
                        <Col md={6}>
                            <FormField
                                label="Email"
                                name="customer_email"
                                type="email"
                                value={formData.customer_email}
                                onChange={handleChange}
                                error={errors.customer_email}
                                required
                                disabled={isLoading}
                            />
                        </Col>
                        <Col md={6}>
                            <FormField
                                label="Телефон"
                                name="customer_phone"
                                value={formData.customer_phone}
                                onChange={handleChange}
                                error={errors.customer_phone}
                                required
                                disabled={isLoading}
                                placeholder="+7 (___) ___-__-__"
                            />
                        </Col>
                    </Row>
                    
                    <FormField
                        label="Адрес"
                        name="shipping_address"
                        value={formData.shipping_address}
                        onChange={handleChange}
                        error={errors.shipping_address}
                        required
                        disabled={isLoading}
                    />
                    
                    <Row>
                        <Col md={6}>
                            <FormField
                                label="Город"
                                name="shipping_city"
                                value={formData.shipping_city}
                                onChange={handleChange}
                                error={errors.shipping_city}
                                required
                                disabled={isLoading}
                            />
                        </Col>
                        <Col md={6}>
                            <FormField
                                label="Почтовый индекс"
                                name="shipping_postal_code"
                                value={formData.shipping_postal_code}
                                onChange={handleChange}
                                error={errors.shipping_postal_code}
                                disabled={isLoading}
                            />
                        </Col>
                    </Row>
                    
                    <Form.Group className="mb-3">
                        <Form.Label>Способ оплаты</Form.Label>
                        <div className="payment-methods">
                            <Form.Check
                                type="radio"
                                id="payment-cash"
                                label="Наличными при получении"
                                name="payment_method"
                                value="cash"
                                checked={formData.payment_method === 'cash'}
                                onChange={handleChange}
                                disabled={isLoading}
                                className="mb-2"
                            />
                            <Form.Check
                                type="radio"
                                id="payment-card"
                                label="Банковской картой"
                                name="payment_method"
                                value="card"
                                checked={formData.payment_method === 'card'}
                                onChange={handleChange}
                                disabled={isLoading}
                                className="mb-2"
                            />
                            <Form.Check
                                type="radio"
                                id="payment-bank"
                                label="Банковский перевод"
                                name="payment_method"
                                value="bank_transfer"
                                checked={formData.payment_method === 'bank_transfer'}
                                onChange={handleChange}
                                disabled={isLoading}
                                className="mb-2"
                            />
                        </div>
                        {errors.payment_method && (
                            <Form.Control.Feedback type="invalid" className="d-block">
                                {errors.payment_method}
                            </Form.Control.Feedback>
                        )}
                    </Form.Group>
                    
                    <FormField
                        label="Комментарий к заказу"
                        name="notes"
                        as="textarea"
                        rows={3}
                        value={formData.notes}
                        onChange={handleChange}
                        disabled={isLoading}
                    />
                    
                    <div className="mb-4">
                        <Form.Check
                            type="checkbox"
                            id="personal-data-consent"
                            label="Я согласен на обработку персональных данных"
                            name="personal_data_consent"
                            checked={formData.personal_data_consent}
                            onChange={handleChange}
                            isInvalid={!!errors.personal_data_consent}
                            disabled={isLoading}
                        />
                        {errors.personal_data_consent && (
                            <Form.Control.Feedback type="invalid" className="d-block">
                                {errors.personal_data_consent}
                            </Form.Control.Feedback>
                        )}
                    </div>
                </Col>
                
                <Col md={5}>
                    <Card className="mb-4">
                        <Card.Header className="bg-light">
                            <h5 className="mb-0">Ваш заказ</h5>
                        </Card.Header>
                        <Card.Body>
                            <Table className="basket-items-table">
                                <thead>
                                    <tr>
                                        <th>Товар</th>
                                        <th>Кол-во</th>
                                        <th className="text-end">Сумма</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {basket.items.map(item => (
                                        <tr key={item.id}>
                                            <td>{item.name}</td>
                                            <td>{item.quantity}</td>
                                            <td className="text-end">
                                                {(item.price * item.quantity).toLocaleString('ru-RU')} ₽
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <th colSpan="2">Итого:</th>
                                        <th className="text-end">{basket.totalPrice.toLocaleString('ru-RU')} ₽</th>
                                    </tr>
                                </tfoot>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            
            <div className="d-flex justify-content-between mt-4">
                <Button 
                    variant="outline-secondary" 
                    onClick={() => navigate(-1)}
                    disabled={isLoading}
                >
                    Вернуться назад
                </Button>
                
                <Button 
                    type="submit" 
                    variant="primary" 
                    className="submit-button bg-main_color" 
                    disabled={isLoading || !formData.personal_data_consent}
                >
                    {isLoading ? 'Оформление заказа...' : 'Оформить заказ'}
                </Button>
            </div>
        </Form>
    );
});

export default CheckoutForm; 