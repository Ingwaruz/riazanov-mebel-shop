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
    const {product} = useContext(Context);

    // Функция для загрузки данных при первой загрузке компонента
    const loadInitialData = async () => {
        try {
            const types = await fetchTypes();
            product.setTypes(types);

            const factories = await fetchFactories();
            product.setFactories(factories);

            const products = await fetchProducts(null, null, 1, 4);
            product.setProducts(products.rows);
            product.setTotalCount(products.count);
        } catch (error) {
            console.error('Error fetching initial data:', error);
        }
    };

    // Функция для загрузки продуктов при изменении фильтров или страницы
    const loadProducts = async () => {
        try {
            const products = await fetchProducts(product.selectedType.id, product.selectedFactory.id, product.page, 4);
            product.setProducts(products.rows);
            product.setTotalCount(products.count);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    useEffect(() => {
        loadInitialData();
    }, []);

    useEffect(() => {
        loadProducts();
    }, [product.page, product.selectedType, product.selectedFactory]);

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
