import React, { useState } from 'react';
import { Card, Col, Image, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { PRODUCT_ROUTE } from '../utils/consts';
import leftArrow from '../assets/left-arrow.svg'; // Иконки стрелок
import rightArrow from '../assets/right-arrow.svg';

const ProductItem = ({ product, factoryName }) => {
    const navigate = useNavigate();

    // Храним индекс текущего изображения
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Проверяем наличие изображений у товара
    const images = product.images || []; // Предполагаем, что поле images передано с сервера

    // Функции для навигации по изображениям
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

    // console.log(process.env.REACT_APP_API_URL + images[currentImageIndex].file);
    // console.log(process.env.REACT_APP_API_URL);
    // console.log("hello there");

    return (
        <Col xs={12} sm={6} md={4} lg={3} className="d-flex justify-content-center">
            <Card
                style={{ cursor: 'pointer', flexGrow: 1, position: 'relative' }}
                className="product-card img-centered border-radius-0 bg-color-white border-color-white"
                onClick={() => navigate(PRODUCT_ROUTE + '/' + product.id)}
            >
                <Col className={'d-flex m-text ms-2 mt-1 '}>{factoryName}</Col>

                <div style={{ position: 'relative', overflow: 'hidden' }}>
                    {images.length > 0 && (
                        <Image
                            className="mb-5 img-centered"
                            src={process.env.REACT_APP_API_URL + images[currentImageIndex].file}
                        />
                    )}
                </div>

                {/* Левая стрелка */}
                {images.length > 1 && (
                    <img
                        src={leftArrow}
                        alt="prev"
                        onClick={(e) => {
                            e.stopPropagation();
                            prevImage();
                        }}
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '10px',
                            transform: 'translateY(-50%)',
                            cursor: 'pointer',
                            opacity: 0.7,
                            width: '50px',
                            backgroundColor: 'rgba(0, 0, 0, 0)', // Прозрачный фон по умолчанию
                            borderRadius: '50%', // Круглая форма
                            padding: '10px',
                            transition: 'background-color 0.3s ease', // Плавный переход
                        }}
                        onMouseEnter={(e) => (e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.6)')} // Темно-серый фон при наведении
                        onMouseLeave={(e) => (e.target.style.backgroundColor = 'rgba(0, 0, 0, 0)')} // Прозрачный фон при выходе
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
                        style={{
                            position: 'absolute',
                            top: '50%',
                            right: '10px',
                            transform: 'translateY(-50%)',
                            cursor: 'pointer',
                            opacity: 0.7,
                            width: '50px',
                            backgroundColor: 'rgba(0, 0, 0, 0)', // Прозрачный фон по умолчанию
                            borderRadius: '50%', // Круглая форма
                            padding: '10px',
                            transition: 'background-color 0.3s ease', // Плавный переход
                        }}
                        onMouseEnter={(e) => (e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.6)')} // Темно-серый фон при наведении
                        onMouseLeave={(e) => (e.target.style.backgroundColor = 'rgba(0, 0, 0, 0)')} // Прозрачный фон при выходе
                    />
                )}

                <Col style={{ position: 'absolute', bottom: '0' }} className="d-flex mx-2 my-2 m-text">
                    {product.name}
                </Col>
            </Card>
        </Col>
    );
};

export default ProductItem;