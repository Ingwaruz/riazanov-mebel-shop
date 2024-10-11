import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Image, Row } from "react-bootstrap";
import { useParams } from 'react-router-dom';
import { fetchOneProduct } from "../processes/productAPI";
import leftArrow from "../shared/assets/left-arrow.svg";
import rightArrow from "../shared/assets/right-arrow.svg";
import '../app/styles/commonStyles.scss';
import '../app/styles/shared.scss';
import ButtonM1 from "../shared/ui/buttons/button-m1";

const ProductPage = () => {
    const [product, setProduct] = useState({ info: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();
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

    useEffect(() => {
        const loadProduct = async () => {
            setLoading(true);
            try {
                const data = await fetchOneProduct(id);
                setProduct(data);
            } catch (error) {
                console.error("Failed to fetch product:", error);
                setError("Не удалось загрузить данные продукта.");
                setProduct({ info: [] });  // Fallback to empty array
            } finally {
                setLoading(false);
            }
        };

        loadProduct();
    }, [id]);

    // Return early if loading
    if (loading) {
        return <div className={'container-fluid mx-3 my-3 xl-text'}>Загрузка...</div>;
    }

    // Return early if error
    if (error) {
        return <div className={'container-fluid mx-3 my-3 xl-text'}>{error}</div>;
    }

    return (
        <div className={'container-fluid mx-3 my-3'}>
            <Row className="d-flex">
                <Col xs={12} sm={6} md={4} lg={3}>
                    <div className="carousel-container">

                        <div
                            className="carousel-images"
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

                        {/*Левая стрелка*/}
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

                        {/*Правая стрелка*/}
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
                    </div>
                </Col>

                <Col xs={12} sm={6} md={4} lg={3}>
                    <Card
                        className={'d-flex flex-column'}
                    >
                        <Col className={'l-text'}>От {product.price || 'Цена отсутсвует'} руб.</Col>
                        <ButtonM1 text={'Добавить в корзину'}/>
                    </Card>
                </Col>
            </Row>
            <Row className={'d-flex justify-content-center align-items-center l-text'}>
                <Col xs={12} sm={6} md={4} lg={3}>
                    {product.name || 'Название отсутствует'}
                </Col>
            </Row>
            <Row className="d-flex flex-column xl-text">
                <Col xs={12} sm={6} md={4} lg={3}>Характеристики</Col>
                {product.info && product.info.length > 0 ? (
                    product.info.map((info, index) => (
                        <Col xs={12} sm={6} md={6} lg={6}>
                            key={info.id}
                            style={{ background: index % 2 === 0 ? 'lightgray' : 'transparent' }}
                        >
                            {info.title}: {info.description}
                        </Col>
                    ))
                ) : (
                    <Col xs={12} sm={12} md={12} lg={12}>
                        Характеристики не найдены.
                    </Col>
                )}
            </Row>

        </div>
    );
};

export default ProductPage;