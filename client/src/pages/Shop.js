import React, {useContext, useEffect} from 'react';
import {Col, Container, Row} from "react-bootstrap";
import TypeBar from "../components/TypeBar";
import FactoryBar from "../components/FactoryBar";
import ProductList from "../components/ProductList";
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import {fetchTypes} from "../http/productAPI";

const Shop = observer(() => {
    const {product} = useContext(Context)

    useEffect(() => {
        fetchTypes().then(data => product.setTypes(data))
    }, []);
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
});

export default Shop;