import React from 'react';
import {Card, Col, Image, Row} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { PRODUCT_ROUTE } from '../utils/consts';

const ProductItem = ({ product, factoryName }) => {
    const navigate = useNavigate();

    return (
        <Col xs={12} sm={6} md={4} lg={3} className="d-flex justify-content-around">
            <Card
                style={{ cursor: 'pointer', flexGrow: 1, position: 'relative' }}
                className="product-card img-centered border-radius-0 bg-color-white"
                onClick={() => navigate(PRODUCT_ROUTE + '/' + product.id)}
            >
                <Col className={'d-flex m-text ms-2 mt-1 '}>{factoryName}</Col>
                <Image
                    className="mx-2 mt-2 mb-5 img-centered"
                    //width={350}
                    src={process.env.REACT_APP_API_URL + product.img}
                />
                <Col style={{position: 'absolute', bottom: '0'}} className="d-flex mx-2 my-2 m-text">{product.name}</Col>
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
