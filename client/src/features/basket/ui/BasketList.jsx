import React from 'react';
import { Alert } from 'react-bootstrap';
import BasketItem from './BasketItem';
import './BasketList.scss';

const BasketList = ({ basketItems, removeFromBasket, changeQuantity }) => {
    if (!basketItems || basketItems.length === 0) {
        return (
            <Alert variant="info" className="text-center">
                <h4>Ваша корзина пуста</h4>
                <p>Добавьте товары для оформления заказа</p>
            </Alert>
        );
    }

    return (
        <div className="basket-list">
            {basketItems.map(item => (
                <BasketItem 
                    key={item.id}
                    product={item}
                    onRemove={removeFromBasket}
                    onQuantityChange={changeQuantity}
                />
            ))}
        </div>
    );
};

export default BasketList; 