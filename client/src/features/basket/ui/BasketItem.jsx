import React from 'react';
import { Row, Col, Button, Image, InputGroup, FormControl } from 'react-bootstrap';
import './BasketItem.scss';

const BasketItem = ({ item, removeFromBasket, changeQuantity }) => {
    const handleRemove = () => {
        removeFromBasket(item.id);
    };

    const handleQuantityChange = (e) => {
        const newQuantity = parseInt(e.target.value) || 1;
        changeQuantity(item.id, newQuantity);
    };
    
    const incrementQuantity = () => {
        changeQuantity(item.id, item.quantity + 1);
    };
    
    const decrementQuantity = () => {
        if (item.quantity > 1) {
            changeQuantity(item.id, item.quantity - 1);
        }
    };

    const totalPrice = item.price * item.quantity;
    
    return (
        <div className="basket-item">
            <Row className="align-items-center g-3">
                <Col xs={12} md={6} className="d-flex align-items-center">
                    <div className="basket-item-image-container">
                        <Image 
                            src={item.img ? `${process.env.REACT_APP_API_URL}/${item.img}` : '/assets/placeholder.jpg'} 
                            alt={item.name}
                            className="basket-item-image"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/assets/placeholder.jpg';
                            }}
                        />
                    </div>
                    <div className="basket-item-info ms-3">
                        <h5 className="mb-1">{item.name}</h5>
                        <div className="d-md-none mb-2 text-muted">
                            {item.price.toLocaleString('ru-RU')} ₽
                        </div>
                        <Button 
                            variant="link" 
                            className="basket-item-remove p-0 text-danger" 
                            onClick={handleRemove}
                        >
                            <i className="fas fa-trash-alt me-1"></i> Удалить
                        </Button>
                    </div>
                </Col>
                
                <Col xs={6} md={2} className="text-center d-none d-md-block">
                    {item.price.toLocaleString('ru-RU')} ₽
                </Col>
                
                <Col xs={6} md={2} className="d-flex justify-content-center">
                    <InputGroup className="basket-item-quantity">
                        <Button 
                            variant="outline-secondary" 
                            onClick={decrementQuantity} 
                            disabled={item.quantity <= 1}
                            className="quantity-btn"
                        >
                            −
                        </Button>
                        <FormControl
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={handleQuantityChange}
                            className="text-center quantity-input"
                        />
                        <Button 
                            variant="outline-secondary" 
                            onClick={incrementQuantity}
                            className="quantity-btn"
                        >
                            +
                        </Button>
                    </InputGroup>
                </Col>
                
                <Col xs={6} md={2} className="text-end">
                    <div className="basket-item-total fw-bold">
                        {totalPrice.toLocaleString('ru-RU')} ₽
                    </div>
                </Col>
            </Row>
            <hr className="my-3" />
        </div>
    );
};

export default BasketItem; 