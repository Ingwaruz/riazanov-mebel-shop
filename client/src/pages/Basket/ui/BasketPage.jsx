import React, { useContext } from 'react';
import { Container, Row, Col, Breadcrumb, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { BasketList, BasketSummary } from '../../../features/basket';
import { SHOP_ROUTE } from '../../../shared/config/route-constants';
import { Context } from '../../../index';
import { observer } from 'mobx-react-lite';
import './BasketPage.scss';

const BasketPage = observer(() => {
    const { basket } = useContext(Context);
    
    const removeFromBasket = (productId) => {
        basket.removeItem(productId);
    };
    
    const changeQuantity = (productId, newQuantity) => {
        basket.changeQuantity(productId, newQuantity);
    };
    
    return (
        <Container fluid className="basket-page py-4">
            <Row className="justify-content-center">
                <Col xs={12} lg={10}>
                    <Breadcrumb className="mb-4">
                        <Breadcrumb.Item linkAs={Link} linkProps={{ to: SHOP_ROUTE }}>
                            Главная
                        </Breadcrumb.Item>
                        <Breadcrumb.Item active>Корзина</Breadcrumb.Item>
                    </Breadcrumb>
                    
                    <h1 className="mb-4">Корзина</h1>
                    
                    {basket.items.length > 0 ? (
                        <Row>
                            <Col lg={8} className="mb-4">
                                <BasketList 
                                    basketItems={basket.items}
                                    removeFromBasket={removeFromBasket}
                                    changeQuantity={changeQuantity}
                                />
                            </Col>
                            <Col lg={4}>
                                <BasketSummary 
                                    totalPrice={basket.totalPrice}
                                />
                            </Col>
                        </Row>
                    ) : (
                        <div className="text-center py-5">
                            <h3>Ваша корзина пуста</h3>
                            <p className="mb-4">Добавьте товары для оформления заказа</p>
                            <Link to={SHOP_ROUTE}>
                                <Button variant="primary" className="bg-main_color">Перейти к покупкам</Button>
                            </Link>
                        </div>
                    )}
                </Col>
            </Row>
        </Container>
    );
});

export default BasketPage; 