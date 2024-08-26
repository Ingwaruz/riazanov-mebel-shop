import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Image, Row } from "react-bootstrap";
import { useParams } from 'react-router-dom';
import { fetchOneProducts } from "../http/productAPI";

const ProductPage = () => {
    const [product, setProduct] = useState({ info: [] });
    const { id } = useParams();

    useEffect(() => {
        fetchOneProducts(id).then(data => {
            if (data && data.info) {
                setProduct({ ...data, info: data.info });
            } else {
                setProduct({ ...data, info: [] });
            }
        }).catch(error => {
            console.error("Failed to fetch product:", error);
            setProduct({ info: [] });  // Fallback to empty array
        });
    }, [id]);

    return (
        <Container className={'mt-3'}>
            <Row>
                <Col md={4} className={'d-flex justify-content-center align-items-center'}>
                    <Image width={350} height={350} src={process.env.REACT_APP_API_URL + product.img} />
                </Col>
                <Col md={4} className={'d-flex justify-content-center align-items-center'}>
                    <h2>{product.name}</h2>
                </Col>
                <Col md={4}>
                    <Card
                        className={'d-flex flex-column align-items-center justify-content-around'}
                        style={{ width: 300, height: 300, fontSize: 32, border: '5px solid lightgray' }}
                    >
                        <h3>От {product.price} руб.</h3>
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
