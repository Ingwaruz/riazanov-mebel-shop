import React, {useEffect, useState} from 'react';
import {Card, Col, Container, Row, Tab, Tabs} from "react-bootstrap";
import {useParams} from 'react-router-dom';
import {fetchOneProduct} from "../processes/productAPI";
import '../app/styles/colors.scss';

const ProductPage = () => {
    const [product, setProduct] = useState(null);
    const {id} = useParams();

    useEffect(() => {
        fetchOneProduct(id).then(data => setProduct(data));
    }, [id]);

    if (!product) {
        return <div>Загрузка...</div>;
    }

    return (
        <Container className="mt-3">
            <Row>
                {/* ... существующий код для изображений ... */}
                <Col md={4}>
                    <Card>
                        <Card.Body>
                            <Card.Title>{product.name}</Card.Title>
                            <Card.Text>
                                Цена: {product.price} руб.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
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