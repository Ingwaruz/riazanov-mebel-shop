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
        return <div className={'container-fluid xl-text'}>Загрузка...</div>;
    }

    // Return early if error
    if (error) {
        return <div className={'container-fluid xl-text'}>{error}</div>;
    }

    return (
        <div className={'container-fluid'}>
            <Col className={'d-flex flex-column xxl-text my-3 mx-5 '}>
                {product.name || 'Название отсутствует'}
            </Col>
            <Row className="d-flex mx-5">
                <Col xs={12} sm={9} md={9} lg={9}>
                    <div className="carousel-container w-35">
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
                        <div className="carousel-container w-15">
                            <div
                                className="carousel-images mt-3"
                                // style={{transform: ``}}
                            >
                                {images.map((image, index) => (
                                    <div>
                                        <Image
                                        key={index}
                                        // onClick={}
                                        className="carousel-image"
                                        src={process.env.REACT_APP_API_URL + image.file}
                                        />
                                    </div>
                                ))}
                            </div>
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

                <Col xs={12} sm={9} md={6} lg={3} className={''}>
                    <Card
                        className={'d-flex flex- border-radius-0 p-2'}
                    >
                        <Col className={'xxl-text'}> {`От ${product.price} ₽` || 'Цена отсутсвует'}</Col>
                        <Col className={'s-text '}>
                            Цена товара зависит от выбранной ткани и может отличаться от указанной
                        </Col>

                        <ButtonM1 text={'Добавить в корзину'}/>
                    </Card>
                </Col>
            </Row>

            <Row className="d-flex flex-column xl-text mx-5">
                <Col xs={12} sm={6} md={4} lg={3}>Характеристики</Col>
                {product.info && product.info.length > 0 ? (
                    product.info.map((info, index) => (
                        <Col xs={12} sm={6} md={4} lg={3}>
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