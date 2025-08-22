import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './BasketSummary.scss';

const BasketSummary = ({ totalPrice }) => {
    const navigate = useNavigate();

    const handleCheckoutClick = () => {
        navigate('/checkout');
    };

    return (
        <Card className="basket-summary">
            <Card.Body>
                <Card.Title>Итого</Card.Title>
                <div className="d-flex justify-content-between mt-3 mb-3">
                    <span>Сумма заказа:</span>
                    <span className="fw-bold">{totalPrice.toLocaleString('ru-RU')} ₽</span>
                </div>
                <Button 
                    variant="primary" 
                    className="w-100 mt-3 bg-main_color" 
                    onClick={handleCheckoutClick}
                >
                    Оформить заказ
                </Button>
            </Card.Body>
        </Card>
    );
};

export default BasketSummary;
