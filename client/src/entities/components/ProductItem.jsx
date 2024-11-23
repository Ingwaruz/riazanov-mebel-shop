import React, { useState } from 'react';
import { Card, Col, Image } from 'react-bootstrap';
import {NavLink, useNavigate} from 'react-router-dom';
import { PRODUCT_ROUTE } from '../utils/consts';
import '../../app/styles/commonStyles.scss';
import leftArrow from "../../shared/assets/left-arrow.svg";
import rightArrow from "../../shared/assets/right-arrow.svg";

const ProductItem = ({ product, factoryName, price }) => {
    const navigate = useNavigate();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [startIndex, setStartIndex] = useState(0);

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

    const handleThumbnailClick = (index) => {
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
                    cursor: 'pointer',
                    flexGrow: 1,
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    height: '100%', // Задаём высоту карточки
                    border: '0',
                }}
                className="product-card img-centered border-radius-0 bg-color_white"
                onClick={() => navigate(PRODUCT_ROUTE + '/' + product.id)}
            >
                {/* Верхняя часть карточки */}
                <div>
                    <Col className={'d-flex m-text mx-3 mt-2 mb-1 '}>{factoryName}</Col>

                    <Col className="d-flex justify-content-center align-items-center mx-3 w-auto">
                        <div className="carousel-container">
                            <div
                                className="d-flex carousel-images"
                                style={{transform: `translateX(-${currentImageIndex * 100}%)`}}
                            >
                                {images.map((image, index) => (
                                    <Image
                                        key={index}
                                        className="carousel-image"
                                        src={process.env.REACT_APP_API_URL + image.file}
                                    />
                                ))}
                            </div>
                            <div className="carousel-container w-15">
                                <div className="carousel-images mt-3 thumbnail-container">
                                    {images.slice(startIndex, startIndex + 5).map((image, index) => (
                                        <div
                                            key={startIndex + index}
                                            onClick={() => handleThumbnailClick(startIndex + index)}
                                            className={`thumbnail ${currentImageIndex === startIndex + index ? "active" : ""}`}
                                        >
                                            <Image
                                                className="carousel-image"
                                                src={`${process.env.REACT_APP_API_URL}${image.file}`}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Col>

                    {/* Левая стрелка */}

                    {images.length > 1 && (
                        <i onClick={prevImage} className="fas fa-angle-left arrow-icon left-arrow main_color"></i>
                    )}

                    {/* Правая стрелка */}
                    {images.length > 1 && (
                        <i onClick={nextImage} className="fas fa-angle-right arrow-icon arrow-icon right-arrow main_color"></i>
                    )}
                </div>

                {/* Нижняя часть карточки */}
                <div>
                    <Col className="d-flex m-text mx-3 my-2">{product.name}</Col>
                    <Col className={'d-flex l-text mx-3 mt-1 mb-2'}>
                        {`Цена от ${price.toLocaleString('ru-RU')} ₽`}
                    </Col>
                </div>
            </Card>
        </Col>
    );
};

export default ProductItem;
