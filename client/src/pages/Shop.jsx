import React, {useContext, useEffect, useState, useCallback} from 'react';
import {Col, Row} from "react-bootstrap";
import ProductList from "../widgets/ProductList";
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import {fetchFactories, fetchProducts, fetchTypes, fetchFilteredProducts} from "../processes/productAPI";
import Filter from "../entities/components/Filter/Filter";
import Pagination from "../entities/components/Pagination/Pagination";
import { useLocation } from 'react-router-dom';

const Shop = observer(() => {
    const {product} = useContext(Context);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(20);
    const location = useLocation();

    // Функция для применения фильтров
    const applyFilters = async (filters) => {
        try {
            const filteredProducts = await fetchFilteredProducts({
                ...filters,
                page: currentPage,
                limit: itemsPerPage
            });
            product.setProducts(filteredProducts.rows);
            product.setTotalCount(filteredProducts.count);
        } catch (error) {
            console.error('Error applying filters:', error);
        }
    };

    // Обработка URL-параметров
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const selectedTypeId = params.get('selectedType');
        const selectedSubtypeId = params.get('selectedSubtype');
        const shouldApplyFilter = params.get('applyFilter') === 'true';

        if (shouldApplyFilter && (selectedTypeId || selectedSubtypeId)) {
            const filters = {
                typeId: selectedTypeId,
                subtypeId: selectedSubtypeId
            };
            applyFilters(filters);
        }
    }, [location.search]);

    // Функция для загрузки данных при первой загрузке компонента
    const loadInitialData = useCallback(async () => {
        try {
            const types = await fetchTypes();
            product.setTypes(types);

            const factories = await fetchFactories();
            product.setFactories(factories);

            const params = new URLSearchParams(location.search);
            const shouldApplyFilter = params.get('applyFilter') === 'true';

            if (!shouldApplyFilter) {
                const products = await fetchProducts(null, null, currentPage, itemsPerPage);
                product.setProducts(products.rows);
                product.setTotalCount(products.count);
            }
        } catch (error) {
            console.error('Error fetching initial data:', error);
        }
    }, [currentPage, itemsPerPage, product, location.search]);

    useEffect(() => {
        loadInitialData();
    }, [loadInitialData]);

    const handleFilterChange = async (filteredProducts) => {
        // Обновляем состояние товаров в store
        product.setProducts(filteredProducts.rows);
        product.setTotalCount(filteredProducts.count);
    };

    const handlePageChange = async (page) => {
        setCurrentPage(page);
        // Плавная прокрутка наверх
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        try {
            let products;
            if (product.selectedType?.id || product.selectedFactory?.id) {
                // Если есть активные фильтры, используем метод фильтрации
                products = await fetchFilteredProducts({
                    typeId: product.selectedType?.id,
                    factoryId: product.selectedFactory?.id,
                    page,
                    limit: itemsPerPage
                });
            } else {
                // Если фильтров нет, используем обычную загрузку
                products = await fetchProducts(
                    null,
                    null,
                    page,
                    itemsPerPage
                );
            }
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
