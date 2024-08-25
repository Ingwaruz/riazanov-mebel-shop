import React from 'react';
import {Button, Card, Col, Container, Image, Row} from "react-bootstrap";

const ProductPage = () => {
    const product = {
        id: 1,
        name: 'Люфтен',
        price: 15000,
        img: 'https://thefurny.eu/upload/iblock/096/09675713a87bbdd4919393cd839a7457.jpg'
    }
    const description = [
        {id:1, title: 'Каркас', description: 'Многослойная березовая фанера'},
        {id:2, title: 'Наполнение', description: 'Пенополиуретан'},
        {id:3, title: 'Наполнение подушек', description: 'Синтешар'},
        {id:4, title: 'Жесткость', description: 'Средний'},
    ]

    return (
        <Container className={'mt-3'}>
            <Row>
                <Col md={4} className={'d-flex justify-content-center align-items-center'}>
                    <Image width={350} height={350} src={product.img}/>
                </Col>
                <Col md={4} className={'d-flex justify-content-center align-items-center'}>
                    <h2>{product.name}</h2>
                </Col>
                <Col md={4}>
                    <Card
                        className={'d-flex flex-column align-items-center justify-content-around'}
                        style={{width: 300, height: 300, fontSize: 32, border: '5px solid lightgray'}}
                    >
                        <h3>От {product.price} руб.</h3>
                        <Button variant={"outline-dark"}>Добавить в корзину</Button>
                    </Card>
                </Col>
            </Row>
            <Row className={'d-flex flex-column m-2'}>
                <h1>Характеристики</h1>
                {description.map((info, index ) =>
                    <Row key={info.id} style={{background: index % 2 === 0 ? 'lightgray' : 'transparent', padding: 10}}>
                        {info.title}: {info.description}
                    </Row>
                )}
            </Row>
        </Container>
    );
};

export default ProductPage;