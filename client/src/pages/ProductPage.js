import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Image, Row } from "react-bootstrap";
import { useParams } from 'react-router-dom';
import { fetchOneProduct } from "../processes/productAPI";
import leftArrow from "../shared/assets/left-arrow.svg";
import rightArrow from "../shared/assets/right-arrow.svg";
import '../shared/styles/commonStyles.scss';

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
            <Row xs={12} sm={6} md={4} lg={3} className="d-flex">
                <Col>
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
                        className={'d-flex flex-column align-items-center justify-content-around'}
                    >
                        <Col className={'l-text'}>От {product.price || 'Цена отсутсвует'} руб.</Col>
                        <Button variant={"hover-item-gray"}>Добавить в корзину</Button>
                    </Card>
                </Col>
            </Row>
            <Row xs={12} sm={6} md={4} lg={3} className={'d-flex justify-content-center align-items-center l-text'}>
                <Col>
                    {product.name || 'Название отсутствует'}
                </Col>
            </Row>
            <Row className={'d-flex flex-column xl-text'}>
                Характеристики
                {product.info && product.info.length > 0 ? (
                    product.info.map((info, index) =>
                        <Row key={info.id}
                             style={{background: index % 2 === 0 ? 'lightgray' : 'transparent'}}>
                            {info.title}: {info.description}
                        </Row>
                    )
                ) : (
                    <Row> Характеристики не найдены.</Row>
                )}
            </Row>
        </div>
    );
};

export default ProductPage;