import React, {useContext, useEffect} from 'react';
import {Col, Container, Row} from "react-bootstrap";
import TypeBar from "../components/TypeBar";
import FactoryBar from "../components/FactoryBar";
import ProductList from "../components/ProductList";
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import {fetchFactories, fetchProducts, fetchTypes} from "../http/productAPI";
import Pages from "../components/Pages";

const Shop = observer(() => {
    const {product} = useContext(Context)

    useEffect(() => {
        fetchTypes().then(data => product.setTypes(data))
        fetchFactories().then(data => product.setFactories(data))
        fetchProducts(null, null, 1, 4).then(data => {
            product.setProducts(data.rows)
            product.setTotalCount(data.count)
        })
    }, []);

    useEffect(() => {
        fetchProducts(product.selectedType.id, product.selectedFactory.id, product.page, 4).then(data => {
            product.setProducts(data.rows)
            product.setTotalCount(data.count)
        })
    }, [product.page, product.selectedType, product.selectedFactory,]);

    return (
        <Container>
            <Row className="mt-2">
                <Col md={3}>
                    <TypeBar/>
                </Col>
                <Col md={9}>
                    <FactoryBar/>
                    <ProductList/>
                    <Pages/>
                </Col>
            </Row>
        </Container>
    );
});

export default Shop;