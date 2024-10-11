import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Image, Row } from "react-bootstrap";
import { useParams } from 'react-router-dom';
import { fetchOneProduct } from "../http/productAPI";
import leftArrow from "../assets/left-arrow.svg";
import rightArrow from "../assets/right-arrow.svg";

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
        return <Container className={'mt-3'}><h1 className={'l-text'}>Загрузка...</h1></Container>;
    }

    // Return early if error
    if (error) {
        return <Container className={'mt-3'}><p>{error}</p></Container>;
    }

    return (
        <Container className={'mt-3'}>
            <Row>
                <Col style={{ width: 'auto' }} className="d-flex mx-3">
                    <div className="carousel-container">
                        
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
                <Col md={4} className={'d-flex justify-content-center align-items-center'}>
                    <h2>{product.name || 'Название отсутствует'}</h2>
                </Col>
                <Col md={4}>
                    <Card
                        className={'d-flex flex-column align-items-center justify-content-around'}
                        style={{ width: 300, height: 300, fontSize: 32, border: '5px solid lightgray' }}
                    >
                        <h1 className={'l-text'}>От {product.price || 'Цена отсутсвует'} руб.</h1>
                        <Button variant={"outline-dark"}>Добавить в корзину</Button>
                    </Card>
                </Col>
            </Row>
            <Row className={'d-flex flex-column m-2'}>
                <h1>Характеристики</h1>
                {product.info && product.info.length > 0 ? (
                    product.info.map((info, index) =>
                        <Row key={info.id} style={{ background: index % 2 === 0 ? 'lightgray' : 'transparent', padding: 10 }}>
                            {info.title}: {info.description}
                        </Row>
                    )
                ) : (
                    <p>Характеристики не найдены.</p>
                )}
            </Row>
        </Container>
    );
};

export default ProductPage;