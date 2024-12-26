import React, {useEffect, useState} from 'react';
import {Card, Col, Container, Row, Tab, Tabs, Image} from "react-bootstrap";
import {useParams} from 'react-router-dom';
import {fetchOneProduct} from "../processes/productAPI";
import '../app/styles/colors.scss';

const ProductPage = () => {
    const [product, setProduct] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const {id} = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const product = await fetchOneProduct(id);
                console.log('Fetched product details:', {
                    id: product.id,
                    name: product.name,
                    images: product.images,
                    apiUrl: process.env.REACT_APP_API_URL,
                    sampleImageUrl: product.images?.[0] ? process.env.REACT_APP_API_URL + product.images[0].img : null,
                    features: product.product_infos
                });
                setProduct(product);
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        };
        fetchData();
    }, [id]);

    if (!product) {
        return <div>Загрузка...</div>;
    }

    const images = product.images || [];
    console.log('Images array:', images);

    const handleImageClick = (index) => {
        setCurrentImageIndex(index);
    };

    return (
        <Container className="mt-3">
            <Row>
                {/* Галерея изображений */}
                <Col md={8}>
                    <div className="main-image-container mb-3">
                        {images.length > 0 ? (
                            <Image
                                src={process.env.REACT_APP_API_URL + images[currentImageIndex].img}
                                alt={product.name}
                                fluid
                                className="main-product-image"
                                onError={(e) => {
                                    console.error('Image load error:', e);
                                    console.log('Failed image URL:', process.env.REACT_APP_API_URL + images[currentImageIndex].img);
                                    console.log('Image object:', images[currentImageIndex]);
                                    console.log('API URL:', process.env.REACT_APP_API_URL);
                                }}
                            />
                        ) : (
                            <div>Нет изображений</div>
                        )}
                    </div>
                    {/* Миниатюры */}
                    {images.length > 0 && (
                        <div className="thumbnails-container d-flex flex-wrap">
                            {images.map((image, index) => (
                                <div
                                    key={index}
                                    className={`thumbnail-wrapper m-2 ${index === currentImageIndex ? 'active' : ''}`}
                                    onClick={() => handleImageClick(index)}
                                >
                                    <Image
                                        src={process.env.REACT_APP_API_URL + image.img}
                                        alt={`${product.name} - изображение ${index + 1}`}
                                        thumbnail
                                        className="product-thumbnail"
                                        onError={(e) => {
                                            console.error('Thumbnail load error:', e);
                                            console.log('Failed thumbnail URL:', process.env.REACT_APP_API_URL + image.img);
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </Col>

                {/* Информация о товаре */}
                <Col md={4}>
                    <Card>
                        <Card.Body>
                            <Card.Title>{product.name}</Card.Title>
                            <Card.Text>
                                {product.min_price ? (
                                    <>
                                        <div>Цена от {product.min_price.toLocaleString('ru-RU')} ₽</div>
                                        <div className="text-muted">
                                            <small>Базовая цена: {product.price.toLocaleString('ru-RU')} ₽</small>
                                        </div>
                                    </>
                                ) : (
                                    <div>Цена: {product.price.toLocaleString('ru-RU')} ₽</div>
                                )}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Характеристики и описание */}
            <Row className="mt-3">
                <Col md={12}>
                    <Tabs defaultActiveKey="description" className="mb-3">
                        <Tab eventKey="description" title="Описание">
                            <p>{product.description || 'Описание отсутствует'}</p>
                        </Tab>
                        <Tab eventKey="characteristics" title="Характеристики">
                            <Row>
                                <Col md={6}>
                                    <h5>Размеры:</h5>
                                    <p>Ширина: {product.width} мм</p>
                                    <p>Глубина: {product.depth} мм</p>
                                    <p>Высота: {product.height} мм</p>
                                </Col>
                                <Col md={6}>
                                    <h5>Дополнительные характеристики:</h5>
                                    {product.product_infos?.map(info => (
                                        <p key={info.id}>
                                            {info.feature?.name}: {info.value}
                                        </p>
                                    ))}
                                </Col>
                            </Row>
                        </Tab>
                    </Tabs>
                </Col>
            </Row>
        </Container>
    );
};

export default ProductPage; 