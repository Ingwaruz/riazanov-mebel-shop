import React from 'react';
import {Card, Col, Image, Row} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { PRODUCT_ROUTE } from '../utils/consts';

const ProductItem = ({ product }) => {
    const navigate = useNavigate();

    return (
        <Col md={5} className="mt-5 d-flex" onClick={() => navigate(PRODUCT_ROUTE + '/' + product.id)}>
            <Card style={{ width: 368, cursor: 'pointer' }} bg={'light'} className={'product-card justify-content-center img-centered'}>
                <Image className={'m-lg-2 img-centered'} width={350} height={350} src={process.env.REACT_APP_API_URL + product.img} />
                <Col className={'d-flex mx-2 m-text'}>{product.name}</Col>
                <Col className={'d-flex xs-text m-lg-2 text-start'}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                </Col>
            </Card>
        </Col>
    );
};

export default ProductItem;
