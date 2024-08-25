import React from 'react';
import {Col, Container, Row} from "react-bootstrap";
import TypeBar from "../components/TypeBar";
import FactoryBar from "../components/FactoryBar";
import ProductList from "../components/ProductList";

const Shop = () => {
    return (
        <Container>
            <Row className="mt-2">
                <Col md ={3}>
                    <TypeBar/>
                </Col>
                <Col md ={9}>
                    <FactoryBar/>
                    <ProductList/>
                </Col>
            </Row>
        </Container>
    );
};

export default Shop;