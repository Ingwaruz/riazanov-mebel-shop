import React from 'react';
import {Card, Col, Image, Row} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { PRODUCT_ROUTE } from '../utils/consts';

const ProductItem = ({ product, factoryName }) => {
    const navigate = useNavigate();

    return (
        <Col xs={12} sm={12} md={12} lg={4} className="d-flex justify-content-around">
            <Card
                style={{ cursor: 'pointer', flexGrow: 1 }}
                className="product-card img-centered border-radius-0 bg-color-light"
                onClick={() => navigate(PRODUCT_ROUTE + '/' + product.id)}
            >
                <Col className={'m-text'}>{factoryName}</Col>
                <Image
                    className="m-lg-2 img-centered"
                    //width={350}
                    src={process.env.REACT_APP_API_URL + product.img}
                />
                <Col className="d-flex mx-2 mb-2 m-text">{product.name}</Col>
                {/*<Col className="d-flex xs-text m-lg-2 text-start">*/}
                {/*    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.*/}
                {/*    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.*/}
                {/*    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.*/}
                {/*</Col>*/}
            </Card>
        </Col>
    );
};

export default ProductItem;
