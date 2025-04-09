import React from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { PRODUCT_ROUTE } from '../../../entities/utils/consts';
import './BasketItem.scss';

const BasketItem = ({ product, onRemove, onQuantityChange }) => {
    const navigate = useNavigate();
    
    const handleRemove = () => {
        onRemove(product.id);
    };
    
    const handleQuantityChange = (change) => {
        const newQuantity = Math.max(1, product.quantity + change);
        onQuantityChange(product.id, newQuantity);
    };
    
    const handleProductClick = () => {
        navigate(PRODUCT_ROUTE + '/' + product.id);
    };
    
    return (
        <Card className="basket-item mb-3">
            <Card.Body>
                <Row className="align-items-center">
                    <Col xs={3} md={2} onClick={handleProductClick} className="cursor-pointer">
                        <img 
                            src={process.env.REACT_APP_API_URL + product.img} 
                            alt={product.name} 
                            className="basket-item-image"
                        />
                    </Col>
                    <Col xs={9} md={4} onClick={handleProductClick} className="cursor-pointer">
                        <h5 className="m-text main_font_color">{product.name}</h5>
                        <p className="text-muted s-text">
                            {product.factory && product.factory.name ? `Производитель: ${product.factory.name}` : ''}
                        </p>
                    </Col>
                    <Col xs={5} md={2} className="d-flex justify-content-center">
                        <div className="quantity-control d-flex align-items-center">
                            <Button 
                                variant="outline-secondary" 
                                size="sm" 
                                onClick={() => handleQuantityChange(-1)}
                                disabled={product.quantity <= 1}
                                className="quantity-btn"
                            >
                                -
                            </Button>
                            <span className="mx-2 quantity-value">{product.quantity}</span>
                            <Button 
                                variant="outline-secondary" 
                                size="sm" 
                                onClick={() => handleQuantityChange(1)}
                                className="quantity-btn"
                            >
                                +
                            </Button>
                        </div>
                    </Col>
                    <Col xs={5} md={3} className="text-right">
                        <h5 className="m-text main_font_color">
                            {(product.price * product.quantity).toLocaleString('ru-RU')} ₽
                        </h5>
                        <small className="text-muted s-text">
                            {product.price.toLocaleString('ru-RU')} ₽ за шт.
                        </small>
                    </Col>
                    <Col xs={2} md={1} className="text-right">
                        <Button 
                            variant="link" 
                            className="text-danger p-0" 
                            onClick={handleRemove}
                        >
                            <i className="bi bi-trash"></i>
                        </Button>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
};

export default BasketItem; 