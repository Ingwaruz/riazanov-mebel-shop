import React, {useContext, useEffect, useState, useCallback} from 'react';
import {Col, Row} from "react-bootstrap";
import ProductList from "../widgets/ProductList";
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import {fetchFactories, fetchProducts, fetchTypes} from "../processes/productAPI";
import Filter from "../entities/components/Filter/Filter";
import Pagination from "../entities/components/Pagination/Pagination";

const Shop = observer(() => {
    const {product} = useContext(Context);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(20);

    // Функция для загрузки данных при первой загрузке компонента
    const loadInitialData = useCallback(async () => {
        try {
            const types = await fetchTypes();
            product.setTypes(types);

            const factories = await fetchFactories();
            product.setFactories(factories);

            const products = await fetchProducts(null, null, currentPage, itemsPerPage);
            product.setProducts(products.rows);
            product.setTotalCount(products.count);
        } catch (error) {
            console.error('Error fetching initial data:', error);
        }
    }, [currentPage, itemsPerPage, product]);

    useEffect(() => {
        loadInitialData();
    }, [loadInitialData]);

    const handleFilterChange = async (filteredProducts) => {
        // Сбрасываем страницу при изменении фильтров
        setCurrentPage(1);
        // Обновляем состояние товаров в store
        product.setProducts(filteredProducts.rows);
        product.setTotalCount(filteredProducts.count);
    };

    const handlePageChange = async (page) => {
        setCurrentPage(page);
        try {
            const products = await fetchProducts(
                product.selectedType?.id,
                product.selectedFactory?.id,
                page,
                itemsPerPage
            );
            product.setProducts(products.rows);
            product.setTotalCount(products.count);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const totalPages = Math.ceil(product.totalCount / itemsPerPage);

    return (
        <div className={'container-fluid'}>
            <Row className="mt-2">
                <Col lg={2} md={4} sm={4} xs={12}>
                    <Filter onFilterChange={handleFilterChange} />
                </Col>
                <Col lg={10} md={8} sm={8} xs={12}>
                    <ProductList/>
                    {totalPages > 1 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    )}
                </Col>
            </Row>
        </div>
    );
});

export default Shop;
