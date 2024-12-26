import React, {useContext, useEffect, useState} from 'react';
import {Col, Container, Row} from "react-bootstrap";
import ProductList from "../widgets/ProductList";
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import {fetchFactories, fetchProducts, fetchTypes} from "../processes/productAPI";
import Filter from "../entities/components/Filter/Filter";

const Shop = observer(() => {
    const {product} = useContext(Context);

    // Функция для загрузки данных при первой загрузке компонента
    const loadInitialData = async () => {
        try {
            const types = await fetchTypes();
            product.setTypes(types);

            const factories = await fetchFactories();
            product.setFactories(factories);

            const products = await fetchProducts(null, null, 1, 12);
            product.setProducts(products.rows);
            product.setTotalCount(products.count);
        } catch (error) {
            console.error('Error fetching initial data:', error);
        }
    };

    useEffect(() => {
        loadInitialData();
    }, []);

    const handleFilterChange = (filteredProducts) => {
        // Обновляем состояние товаров в store
        product.setProducts(filteredProducts.rows);
        product.setTotalCount(filteredProducts.count);
    };

    return (
        <div className={'container-fluid'}>
            <Row className="mt-2">
                <Col lg={2} md={4} sm={4} xs={12}>
                    <Filter onFilterChange={handleFilterChange} />
                </Col>
                <Col lg={10} md={8} sm={8} xs={12}>
                    <ProductList/>
                </Col>
            </Row>
        </div>
    );
});

export default Shop;
