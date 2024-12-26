import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Image, Row } from "react-bootstrap";
import { useParams } from 'react-router-dom';
import { fetchOneProduct } from "../../processes/productAPI";
import '../../app/styles/shared.scss';
import '../../app/styles/colors.scss';
import ButtonM1 from "../../shared/ui/buttons/button-m1";
import TabList from '../../widgets/TabList/TabList';
import "./productPage.scss";

const ProductPage = () => {
    const [product, setProduct] = useState({ info: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const images = product.images || [];
    const [startIndex, setStartIndex] = useState(0);

    const handleThumbnailClick = (index) => {
        setCurrentImageIndex(index);
        if (index < startIndex) {
            setStartIndex(index);
        } else if (index >= startIndex + 5) {
            setStartIndex(index - 4);
        }
    };

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
                setProduct({ info: [] });
            } finally {
                setLoading(false);
            }
        };
        loadProduct();
    }, [id]);

    if (loading) return <div className="container-fluid xl-text">Загрузка...</div>;
    if (error) return <div className="container-fluid xl-text">{error}</div>;

    const tabs = [
        {
            key: 'description',
            title: 'Описание',
            content: (
                <>
                    {product.description && (
                        <Col className="mt-3" xs={12}>
                            {product.description}
                        </Col>
                    )}
                </>
            )
        },
        {
            key: 'specifications',
            title: 'Характеристики',
            content: (
                <div>
                    {/* Основные размеры */}
                    <div className="characteristic-line">
                        <span>Ширина</span>
                        <span>{product.width} см</span>
                    </div>
                    <div className="characteristic-line">
                        <span>Глубина</span>
                        <span>{product.depth} см</span>
                    </div>
                    <div className="characteristic-line">
                        <span>Высота</span>
                        <span>{product.height} см</span>
                    </div>

                    {/* Характеристики из product_infos */}
                    {product.product_infos?.map(info => (
                        <div key={info.id} className="characteristic-line">
                            <span>{info.feature?.name.charAt(0).toUpperCase() + info.feature?.name.slice(1).toLowerCase()}</span>
                            <span>{info.value}</span>
                        </div>
                    ))}
                </div>
            )
        }
    ];

    return (
        <div className="container-fluid">
            <Row className="d-flex mx-5">
                <Row className="d-flex flex-column xxl-text m-0 my-4">
                    {product.name || 'Название отсутствует'}
                </Row>
                <Col xs={12} sm={9} md={9} lg={9}>
                    <div className="carousel-container w-35">
                        <div
                            className="carousel-images"
                            style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
                        >
                            {images.map((image, index) => (
                                <Image
                                    key={index}
                                    className="carousel-image"
                                    src={`${process.env.REACT_APP_API_URL}${image.img}`}
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
                                            className="carousel-images"
                                            src={`${process.env.REACT_APP_API_URL}${image.img}`}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                        {images.length > 1 && (
                            <i
                                onClick={prevImage}
                                className="fa-2x fas fa-angle-left arrow-icon left-arrow main_font_color"
                            ></i>
                        )}

                        {/* Правая стрелка */}
                        {images.length > 1 && (
                            <i
                                onClick={nextImage}
                                className="fa-2x fas fa-angle-right arrow-icon right-arrow main_font_color"
                            ></i>
                        )}
                    </div>
                    <div className="d-flex flex-column xl-text mt-5">
                        <TabList tabs={tabs} />
                    </div>
                </Col>
                <Col xs={12} sm={9} md={6} lg={3}>
                    <Card
                        style={{ boxShadow: '0px 0px 32px rgba(0, 0, 0, 0.08)' }}
                        className="border-white d-flex border-radius-0 p-2 sticky-card"
                    >
                        <div className="xxl-text">{`~ ${product.price} ₽`}</div>
                        {product.min_price && (
                            <div className="l-text text-muted mt-2">
                                {`От ${product.min_price} ₽`}
                            </div>
                        )}
                        <div className="s-text">
                            Цена товара зависит от выбранной ткани и может отличаться от указанной
                        </div>
                        <ButtonM1 text="Добавить в корзину" />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default ProductPage;
