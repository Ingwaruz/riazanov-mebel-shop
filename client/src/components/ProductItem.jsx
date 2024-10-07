import React, { useState } from 'react';
import { Card, Col, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { PRODUCT_ROUTE } from '../utils/consts';
import leftArrow from '../assets/left-arrow.svg';
import rightArrow from '../assets/right-arrow.svg';
import '../styles/commonStyles.scss'; // Подключаем SCSS файл

const ProductItem = ({ product, factoryName, price }) => {
    const navigate = useNavigate();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const images = product.images || [];

    const nextImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    return (
        <Col xs={12} sm={6} md={4} lg={3} className="d-flex justify-content-center">
            <Card
                style={{ cursor: 'pointer', flexGrow: 1, position: 'relative', border: '0' }}
                className="product-card img-centered border-radius-0 bg-color-white"
                onClick={() => navigate(PRODUCT_ROUTE + '/' + product.id)}
            >
                <Col className={'d-flex m-text mx-3 mt-2 mb-1 '}>{factoryName}</Col>

                <Col style={{ width: 'auto' }} className="d-flex mx-3">
                    <div className="carousel-container">
                        <div
                            className="carousel-images"
                            style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
                        >
                            {images.map((image, index) => (
                                <Image
                                    key={index}
                                    className="carousel-image"
                                    src={process.env.REACT_APP_API_URL + image.file}
                                />
                            ))}
                        </div>
                    </div>
                </Col>

                {/* Левая стрелка */}
                {images.length > 1 && (
                    <img
                        src={leftArrow}
                        alt="prev"
                        onClick={(e) => {
                            e.stopPropagation();
                            prevImage();
                        }}
                        className="arrow-icon left-arrow"
                    />
                )}

                {/* Правая стрелка */}
                {images.length > 1 && (
                    <img
                        src={rightArrow}
                        alt="next"
                        onClick={(e) => {
                            e.stopPropagation();
                            nextImage();
                        }}
                        className="arrow-icon right-arrow"
                    />
                )}

                {/* Название товара под изображением */}
                <Col className="d-flex m-text mx-3 my-2">
                    {product.name}
                </Col>

                {/* Кнопка "Подробнее" */}
                <Col className={'d-flex l-text mx-3 mt-1 mb-2'}>
                    {`Цена от ${price.toLocaleString('ru-RU')} ₽`}
                </Col>
                {/*<Col className="learn-more m-text p-1" onClick={() => navigate(PRODUCT_ROUTE + '/' + product.id)}>*/}
                {/*    Подробнее*/}
                {/*</Col>*/}
            </Card>
        </Col>
    );
};

export default ProductItem;
