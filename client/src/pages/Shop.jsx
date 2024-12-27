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
    const [currentFilters, setCurrentFilters] = useState({});

    // Функция для применения фильтров
    const applyFilters = async (filters, page = 1) => {
        try {
            const filteredProducts = await fetchFilteredProducts({
                ...filters,
                page,
                limit: itemsPerPage
            });
            product.setProducts(filteredProducts.rows);
            product.setTotalCount(filteredProducts.count);
            setCurrentFilters(filters);
            setCurrentPage(page);
        } catch (error) {
            console.error('Error applying filters:', error);
        }
    };

    // Функция для загрузки данных при первой загрузке компонента
    const loadInitialData = useCallback(async () => {
        try {
            const types = await fetchTypes();
            product.setTypes(types);

            const factories = await fetchFactories();
            product.setFactories(factories);

            const products = await fetchProducts(null, null, 1, itemsPerPage);
            product.setProducts(products.rows);
            product.setTotalCount(products.count);
        } catch (error) {
            console.error('Error fetching initial data:', error);
        }
    }, [itemsPerPage, product]);

    // Обработка URL-параметров и обновления страницы
    useEffect(() => {
        // Проверяем, было ли обновление страницы
        const isPageRefresh = !window.performance.navigation || 
            window.performance.navigation.type === 1 ||
            !document.referrer;

        if (isPageRefresh) {
            // При обновлении страницы очищаем URL и загружаем все товары
            const cleanUrl = window.location.pathname;
            window.history.replaceState({}, '', cleanUrl);
            loadInitialData();
            return;
        }

        const params = new URLSearchParams(location.search);
        const selectedTypeId = params.get('selectedType');
        const selectedSubtypeId = params.get('selectedSubtype');
        const shouldApplyFilter = params.get('applyFilter') === 'true';

        if (shouldApplyFilter && (selectedTypeId || selectedSubtypeId)) {
            const filters = {
                typeId: selectedTypeId,
                selectedSubtype: selectedSubtypeId
            };
            applyFilters(filters, 1);
        } else {
            loadInitialData();
        }
    }, [location.search, loadInitialData]);

    const handleFilterChange = async (filteredProducts, filters) => {
        product.setProducts(filteredProducts.rows);
        product.setTotalCount(filteredProducts.count);
        setCurrentFilters(filters);
        setCurrentPage(1);
    };

    const handlePageChange = async (page) => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        try {
            if (Object.keys(currentFilters).length > 0) {
                await applyFilters(currentFilters, page);
            } else {
                const products = await fetchProducts(null, null, page, itemsPerPage);
                product.setProducts(products.rows);
                product.setTotalCount(products.count);
                setCurrentPage(page);
            }
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
