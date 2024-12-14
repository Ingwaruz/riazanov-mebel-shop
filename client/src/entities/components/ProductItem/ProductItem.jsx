import React, { useState } from 'react';
import { Card, Col, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { PRODUCT_ROUTE } from '../../utils/consts';
import "./productItem.scss";

const ProductItem = ({ product, factoryName, price }) => {
    const navigate = useNavigate();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [startIndex, setStartIndex] = useState(0);

    const images = product.images || [];

    const nextImage = (e) => {
        e.stopPropagation(); // Останавливаем всплытие
        setCurrentImageIndex((prevIndex) =>
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevImage = (e) => {
        e.stopPropagation(); // Останавливаем всплытие
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    const handleThumbnailClick = (e, index) => {
        e.stopPropagation(); // Останавливаем всплытие
        setCurrentImageIndex(index);
        if (index < startIndex) {
            setStartIndex(index);
        } else if (index >= startIndex + 5) {
            setStartIndex(index - 4);
        }
    };

    return (
        <Col xs={12} sm={6} md={4} lg={3} className="d-flex justify-content-center">
            <Card
                style={{
                    justifyContent: 'space-between',
                }}
                className="d-flex position-relative product-card img-centered border-radius-0 bg-color_white border-0 h-100 flex-column cursor-pointer flex-grow-1"
                onClick={() => navigate(PRODUCT_ROUTE + '/' + product.id)}
            >
                {/* Верхняя часть карточки */}
                <div>
                    <Col className="d-flex m-text mx-3 mt-2 mb-1 flex-shrink-0">
                        {factoryName}
                    </Col>
                </div>

                {/* Центрируем изображение */}
                <div
                    style={{
                        flex: '1',
                    }}
                    className="d-flex justify-content-center align-items-center overflow-hidden"
                >
                    {images.length > 0 && (
                        <Image
                            key={currentImageIndex}
                            className="carousel-image px-3 object-fit-contain mh-100 mw-100"
                            src={process.env.REACT_APP_API_URL + images[currentImageIndex].file}
                        />
                    )}
                </div>

                {/* Нижняя часть карточки */}
                <div style={{ flexShrink: 0 }}>
                    {/* Ряд миниатюр */}
                    {images.length > 1 && (
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
                                        className="carousel-image"
                                        src={process.env.REACT_APP_API_URL + image.file}
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Название и цена товара */}
                    <Col className="d-flex m-text mx-3 my-2">{product.name}</Col>
                    <Col className="d-flex l-text mx-3 mt-1 mb-2">
                        {`Цена от ${price.toLocaleString('ru-RU')} ₽`}
                    </Col>
                </div>
            </Card>
        </Col>
    );
};

export default ProductItem;
