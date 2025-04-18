import React from 'react';
import { Row, Col, Card, Alert } from 'react-bootstrap';
import BasketItem from './BasketItem';
import './BasketList.scss';

const BasketList = ({ basketItems, removeFromBasket, changeQuantity }) => {
    if (!basketItems || basketItems.length === 0) {
        return (
            <Alert variant="info">
                Ваша корзина пуста. Добавьте товары для оформления заказа.
            </Alert>
        );
    }

    return (
        <Card className="basket-list">
            <Card.Body>
                <div className="d-none d-md-flex basket-header mb-3">
                    <Col md={6} className="fw-bold">Товар</Col>
                    <Col md={2} className="fw-bold text-center">Цена</Col>
                    <Col md={2} className="fw-bold text-center">Количество</Col>
                    <Col md={2} className="fw-bold text-end">Сумма</Col>
                </div>
                {basketItems.map(item => (
                    <BasketItem
                        key={item.id}
                        item={item}
                        removeFromBasket={removeFromBasket}
                        changeQuantity={changeQuantity}
                    />
                ))}
            </Card.Body>
        </Card>
    );
};

export default BasketList; 