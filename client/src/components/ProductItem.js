import React from 'react';
import { Card, Col, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { PRODUCT_ROUTE } from '../utils/consts';

const ProductItem = ({ product }) => {
    const navigate = useNavigate();

    return (
        <Col md={5} className="mt-3" onClick={() => navigate(PRODUCT_ROUTE + '/' + product.id)}>
            <Card style={{ width: 150, cursor: 'pointer' }} border={'light'}>
                <Image width={350} height={350} src={product.img} />
                <div className="d-flex justify-content-center">
                    <div>Ardoni</div>
                </div>
            </Card>
        </Col>
    );
};

export default ProductItem;
