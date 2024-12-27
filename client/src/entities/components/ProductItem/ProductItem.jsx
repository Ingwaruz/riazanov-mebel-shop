import React, { useState, useEffect } from 'react';
import { Card, Col, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { PRODUCT_ROUTE } from '../../utils/consts';
import "./productItem.scss";
import { observer } from 'mobx-react-lite';

const ProductItem = observer(({ product }) => {
    const navigate = useNavigate();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [startIndex, setStartIndex] = useState(0);
    const [imageError, setImageError] = useState(false);

    const defaultImage = '/placeholder.svg'; // Обновленный путь к SVG-заглушке

    useEffect(() => {
        setCurrentImageIndex(0);
        setStartIndex(0);
        setImageError(false);
    }, [product.id]);

    const images = Array.isArray(product.images) ? product.images : [];
    const hasValidImages = images.length > 0 && images.some(img => img?.img);

    const handleThumbnailClick = (e, index) => {
        e.stopPropagation();
        setCurrentImageIndex(index);
        if (index < startIndex) {
            setStartIndex(index);
        } else if (index >= startIndex + 5) {
            setStartIndex(index - 4);
        }
    };

    const handleImageError = (e) => {
        console.error('Image load error for product:', product.id);
        setImageError(true);
        e.target.src = defaultImage;
    };

    return (
        <Col xs={12} sm={6} md={6} lg={3} className="d-flex justify-content-center mb-4">
            <Card
                style={{
                    justifyContent: 'space-between',
                    width: '100%',
                    margin: '0 8px'
                }}
                className="d-flex position-relative product-card img-centered border-radius-0 bg-color_white border-0 h-100 flex-column cursor-pointer flex-grow-1"
                onClick={() => navigate(PRODUCT_ROUTE + '/' + product.id)}
            >
                <div
                    style={{
                        flex: '1',
                    }}
                    className="d-flex justify-content-center align-items-center overflow-hidden image-container"
                >
                    <Image
                        className="px-3 object-fit-contain w-100 h-100"
                        src={hasValidImages && !imageError 
                            ? process.env.REACT_APP_API_URL + images[currentImageIndex]?.img 
                            : defaultImage}
                        onError={handleImageError}
                    />
                </div>

                <div style={{ flexShrink: 0 }}>
                    {hasValidImages && images.length > 1 && !imageError && (
                        <div className="carousel-container w-15 mt-3 px-3 thumbnail-container">
                            {images.slice(startIndex, startIndex + 5).map((image, index) => (
                                <div
                                    key={startIndex + index}
                                    onClick={(e) => handleThumbnailClick(e, startIndex + index)}
                                    className={`thumbnail ${
                                        currentImageIndex === startIndex + index ? 'active' : ''
                                    }`}
                                >
                                    <Image
                                        className="carousel-images"
                                        src={process.env.REACT_APP_API_URL + image.img}
                                        onError={handleImageError}
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    <Col className="d-flex m-text mx-3 my-2">{product.name}</Col>
                    <Col className="d-flex l-text mx-3 mt-1 mb-2">
                    {product.min_price ? 
                        `Цена от ${product.min_price.toLocaleString('ru-RU')} ₽` : 
                        `Цена ~ ${product.price.toLocaleString('ru-RU')} ₽`}
                    </Col>
                </div>
            </Card>
        </Col>
    );
});

export default ProductItem;
