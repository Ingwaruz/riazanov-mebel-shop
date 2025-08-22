import React, { useContext } from 'react';
import { Container, Row, Col, Breadcrumb } from 'react-bootstrap';
import { Link, Navigate } from 'react-router-dom';
import { CheckoutForm } from '../../../features/checkout';
import { BASKET_ROUTE, SHOP_ROUTE } from '../../../shared/config/route-constants';
import { Context } from '../../../index';
import { observer } from 'mobx-react-lite';
import './CheckoutPage.scss';

const CheckoutPage = observer(() => {
    const { basket } = useContext(Context);
    
    // Если корзина пуста, перенаправляем на страницу корзины
    if (basket.items.length === 0) {
        return <Navigate to={BASKET_ROUTE} />;
    }
    
    return (
        <Container fluid className="checkout-page py-4">
            <Row className="justify-content-center">
                <Col xs={12} lg={10}>
                    <Breadcrumb className="mb-4">
                        <Breadcrumb.Item linkAs={Link} linkProps={{ to: SHOP_ROUTE }}>
                            Главная
                        </Breadcrumb.Item>
                        <Breadcrumb.Item linkAs={Link} linkProps={{ to: BASKET_ROUTE }}>
                            Корзина
                        </Breadcrumb.Item>
                        <Breadcrumb.Item active>Оформление заказа</Breadcrumb.Item>
                    </Breadcrumb>
                    
                    <h1 className="mb-4">Оформление заказа</h1>
                    
                    <CheckoutForm />
                </Col>
            </Row>
        </Container>
    );
});

export default CheckoutPage; 