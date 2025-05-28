import React, { useContext, useEffect, useState, useCallback } from 'react';
import { Col, Row } from "react-bootstrap";
import { observer } from "mobx-react-lite";
import { Context } from "../../../index";
import { useLocation, useNavigate } from 'react-router-dom';
import { FilterForm, filterApi } from "../../../features/product-filters";
import { SubtypeFilter } from "../../../features/subtype-filter";
import { ProductList } from "../../../widgets";
import { Pagination } from "../../../shared/ui/Pagination";
import { productApi } from "../../../entities/product";
import './ShopPage.scss';

const ShopPage = observer(() => {
    const { product } = useContext(Context);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(20);
    const location = useLocation();
    const navigate = useNavigate();
    const [currentFilters, setCurrentFilters] = useState({});
    const [selectedTypes, setSelectedTypes] = useState([]);

    // Функция для применения фильтров
    const applyFilters = async (filters, page = 1) => {
        try {
            const filteredProducts = await filterApi.fetchFilteredProducts({
                ...filters,
                page,
                limit: itemsPerPage
            });
            product.setProducts(filteredProducts.rows);
            product.setTotalCount(filteredProducts.count);
            setCurrentFilters(filters);
            setCurrentPage(page);

            // Обновляем URL с учетом примененных фильтров
            const params = new URLSearchParams();
            if (filters.typeIds) {
                const typeIdsArray = JSON.parse(filters.typeIds);
                if (typeIdsArray.length > 0) {
                    params.set('selectedType', typeIdsArray[0]);
                }
            }
            if (filters.selectedSubtypes && filters.selectedSubtypes.length > 0) {
                params.set('selectedSubtypes', filters.selectedSubtypes.join(','));
            }
            if (Object.keys(filters).length > 0) params.set('applyFilter', 'true');
            navigate(`${location.pathname}?${params.toString()}`);
        } catch (error) {
            console.error('Error applying filters:', error);
        }
    };

    // Функция для загрузки данных при первой загрузке компонента
    const loadInitialData = useCallback(async () => {
        try {
            const types = await filterApi.fetchTypes();
            product.setTypes(types);

            const factories = await filterApi.fetchFactories();
            product.setFactories(factories);

            const products = await productApi.fetchProducts(null, null, 1, itemsPerPage);
            product.setProducts(products.rows);
            product.setTotalCount(products.count);
        } catch (error) {
            console.error('Error fetching initial data:', error);
        }
    }, [itemsPerPage, product]);

    // Обработка URL-параметров и обновления страницы
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const selectedTypeId = params.get('selectedType');
        const selectedSubtypesParam = params.get('selectedSubtypes');
        const shouldApplyFilter = params.get('applyFilter') === 'true';

        // ВАЖНО: При перезагрузке страницы фильтры НЕ восстанавливаются
        // Фильтры применяются только при активном использовании фильтров в сессии
        // Если в URL нет явного флага applyFilter, загружаем все товары без фильтров
        if (shouldApplyFilter && (selectedTypeId || selectedSubtypesParam)) {
            const filters = {};
            if (selectedTypeId) {
                filters.typeIds = JSON.stringify([parseInt(selectedTypeId)]);
            }
            if (selectedSubtypesParam) {
                filters.selectedSubtypes = selectedSubtypesParam.split(',');
            }
            applyFilters(filters, 1);
        } else {
            // При любой перезагрузке или прямом переходе сбрасываем фильтры
            // Очищаем URL от параметров фильтров
            if (params.toString()) {
                navigate(location.pathname, { replace: true });
            }
            loadInitialData();
        }
    }, [location.search, loadInitialData]);

    const handleFilterChange = async (filteredProducts, filters) => {
        product.setProducts(filteredProducts.rows);
        product.setTotalCount(filteredProducts.count);
        setCurrentFilters(filters);
        setCurrentPage(1);
    };

    const handleSelectedTypesChange = (types) => {
        setSelectedTypes(types);
    };

    const handleSubtypeSelect = async (subtypeIds) => {
        const newFilters = { ...currentFilters };
        
        if (!subtypeIds || subtypeIds.length === 0) {
            // Удаляем фильтр по подтипам
            delete newFilters.selectedSubtypes;
        } else {
            // Устанавливаем фильтр по подтипам
            newFilters.selectedSubtypes = subtypeIds;
        }
        
        await applyFilters(newFilters, 1);
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
                const products = await productApi.fetchProducts(null, null, page, itemsPerPage);
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
        <div className="container-fluid shop-page">
            <Row className="mt-2">
                <Col lg={2} md={4} sm={4} xs={12} className="filter-column">
                    <FilterForm 
                        onFilterChange={handleFilterChange} 
                        onSelectedTypesChange={handleSelectedTypesChange}
                    />
                </Col>
                <Col lg={10} md={8} sm={8} xs={12} className="product-column">
                    <SubtypeFilter 
                        selectedTypes={selectedTypes}
                        currentFilters={currentFilters}
                        onSubtypeSelect={handleSubtypeSelect}
                    />
                    <ProductList />
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

export default ShopPage; 