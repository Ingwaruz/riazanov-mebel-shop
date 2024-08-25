import React from 'react';
import {Card, Col, Image} from "react-bootstrap";

const ProductItem = ({product}) => {
    return (
        <Col md={5}>
            <Card style={{width: 150, cursor: 'pointer'}} border={'light'}>
                <Image width={350} height={350} src={product.img}/>
                <div className="d-flex justify-content-center">
                    <div>Ardoni</div>
                </div>
            </Card>
        </Col>
    );
};

export default ProductItem;