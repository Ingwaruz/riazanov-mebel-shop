import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Breadcrumb } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { BasketList, BasketSummary } from '../../../features/basket';
import { SHOP_ROUTE } from '../../../shared/config/route-constants';
import './BasketPage.scss';

const BasketPage = () => {
    const [basketItems, setBasketItems] = useState([]);
    
    // Загрузка элементов корзины при монтировании компонента
    useEffect(() => {
        // Здесь будет загрузка из локального хранилища или API
        const savedItems = localStorage.getItem('basketItems');
        if (savedItems) {
            try {
                const parsedItems = JSON.parse(savedItems);
                setBasketItems(parsedItems);
            } catch (e) {
                console.error('Ошибка при парсинге корзины:', e);
                setBasketItems([]);
            }
        }
    }, []);
    
    // Сохранение элементов корзины при их изменении
    useEffect(() => {
        localStorage.setItem('basketItems', JSON.stringify(basketItems));
    }, [basketItems]);
    
    // Удаление товара из корзины
    const removeFromBasket = (productId) => {
        setBasketItems(prevItems => prevItems.filter(item => item.id !== productId));
    };
    
    // Изменение количества товара
    const changeQuantity = (productId, newQuantity) => {
        setBasketItems(prevItems => 
            prevItems.map(item => 
                item.id === productId 
                    ? { ...item, quantity: newQuantity } 
                    : item
            )
        );
    };
    
    // Оформление заказа
    const handleCheckout = () => {
        console.log('Оформление заказа:', basketItems);
        // Здесь будет логика оформления заказа
    };
    
    return (
        <Container className="basket-page py-4">
            <Breadcrumb className="mb-4">
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: SHOP_ROUTE }}>
                    Главная
                </Breadcrumb.Item>
                <Breadcrumb.Item active>Корзина</Breadcrumb.Item>
            </Breadcrumb>
            
            <h1 className="mb-4">Корзина</h1>
            
            <Row>
                <Col lg={8} className="mb-4">
                    <BasketList 
                        basketItems={basketItems}
                        removeFromBasket={removeFromBasket}
                        changeQuantity={changeQuantity}
                    />
                </Col>
                <Col lg={4}>
                    <BasketSummary 
                        basketItems={basketItems}
                        onCheckout={handleCheckout}
                    />
                </Col>
            </Row>
        </Container>
    );
};

export default BasketPage; 