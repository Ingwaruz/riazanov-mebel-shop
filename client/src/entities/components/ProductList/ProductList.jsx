import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './ProductList.scss';

const ProductList = ({ products, onProductClick }) => {
    const navigate = useNavigate();
    
    const handleProductClick = (product) => {
        if (onProductClick) {
            onProductClick(product);
        } else {
            navigate(`/product/${product.id}`);
        }
    };
    
    if (!products || products.length === 0) {
        return <div className="text-center mt-4">Товары не найдены</div>;
    }
    
    return (
        <Row className="product-list">
            {products.map(product => (
                <Col key={product.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                    <Card 
                        className="product-item h-100" 
                        onClick={() => handleProductClick(product)}
                    >
                        <div className="product-image-container">
                            {product.images && product.images.length > 0 ? (
                                <Card.Img 
                                    variant="top" 
                                    src={process.env.REACT_APP_API_URL + '/' + product.images[0].img} 
                                    className="product-image"
                                />
                            ) : (
                                <div className="no-image">Нет изображения</div>
                            )}
                        </div>
                        <Card.Body className="d-flex flex-column">
                            <Card.Title className="product-title mb-2">
                                {product.name}
                            </Card.Title>
                            <div className="product-info mt-auto">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="product-price">
                                        {product.price > 0 ? (
                                            <span>{product.price} ₽</span>
                                        ) : product.min_price > 0 ? (
                                            <span>от {product.min_price} ₽</span>
                                        ) : (
                                            <span>Цена по запросу</span>
                                        )}
                                    </div>
                                    <div className="product-id">
                                        ID: {product.id}
                                    </div>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            ))}
        </Row>
    );
};

export default ProductList; 