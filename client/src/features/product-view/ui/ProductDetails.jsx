import React from 'react';
import { Card, ListGroup, Button, Badge } from 'react-bootstrap';
import { formatPrice } from '../../../shared/lib/formatters';
import './ProductDetails.scss';

const ProductDetails = ({ product, onAddToCart }) => {
    if (!product) {
        return <div>Загрузка информации о товаре...</div>;
    }

    const handleAddToCart = () => {
        if (onAddToCart) {
            onAddToCart(product);
        }
    };

    return (
        <div className="product-details">
            <h2 className="product-title">{product.name}</h2>
            
            <div className="product-price-section mb-4">
                <div className="product-price">{formatPrice(product.price)}</div>
                {product.old_price && product.old_price > product.price && (
                    <div className="old-price">{formatPrice(product.old_price)}</div>
                )}
            </div>
            
            <div className="product-actions mb-4">
                <Button 
                    onClick={handleAddToCart} 
                    className="add-to-cart-btn"
                    variant="outline-primary"
                >
                    В корзину
                </Button>
            </div>
            
            <Card className="mb-4">
                <Card.Header className="bg-white">
                    <h5 className="mb-0">Характеристики</h5>
                </Card.Header>
                <ListGroup variant="flush">
                    {product.factory && (
                        <ListGroup.Item className="d-flex justify-content-between">
                            <span className="feature-name">Производитель</span>
                            <span className="feature-value">{product.factory.name}</span>
                        </ListGroup.Item>
                    )}
                    {product.type && (
                        <ListGroup.Item className="d-flex justify-content-between">
                            <span className="feature-name">Категория</span>
                            <span className="feature-value">{product.type.name}</span>
                        </ListGroup.Item>
                    )}
                    {product.width && (
                        <ListGroup.Item className="d-flex justify-content-between">
                            <span className="feature-name">Ширина</span>
                            <span className="feature-value">{product.width} см</span>
                        </ListGroup.Item>
                    )}
                    {product.depth && (
                        <ListGroup.Item className="d-flex justify-content-between">
                            <span className="feature-name">Глубина</span>
                            <span className="feature-value">{product.depth} см</span>
                        </ListGroup.Item>
                    )}
                    {product.height && (
                        <ListGroup.Item className="d-flex justify-content-between">
                            <span className="feature-name">Высота</span>
                            <span className="feature-value">{product.height} см</span>
                        </ListGroup.Item>
                    )}
                </ListGroup>
            </Card>
            
            {/* {product.product_infos && product.product_infos.length > 0 && (
                <Card className="mb-4">
                    <Card.Header className="bg-white">
                        <h5 className="mb-0">Дополнительные характеристики</h5>
                    </Card.Header>
                    <ListGroup variant="flush">
                        {product.product_infos.map((info, index) => (
                            <ListGroup.Item key={index} className="d-flex justify-content-between">
                                <span className="feature-name">{info.feature?.name || info.title}</span>
                                <span className="feature-value">{info.description}</span>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Card>
            )}
            
            {product.description && (
                <Card className="mb-4">
                    <Card.Header className="bg-white">
                        <h5 className="mb-0">Описание</h5>
                    </Card.Header>
                    <Card.Body>
                        <div className="product-description">{product.description}</div>
                    </Card.Body>
                </Card>
            )} */}
        </div>
    );
};

export default ProductDetails; 