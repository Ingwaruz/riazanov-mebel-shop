import React, { useContext, useEffect, useState, useCallback, useMemo, Suspense } from 'react';
import { Col, Row, Spinner } from "react-bootstrap";
import { observer } from "mobx-react-lite";
import { Context } from "../../../index";
import { useLocation, useNavigate } from 'react-router-dom';
import { FilterForm, filterApi } from "../../../features/product-filters";
import { SubtypeFilter } from "../../../features/subtype-filter";
import { ProductList } from "../../../widgets";
import { Pagination } from "../../../shared/ui/Pagination";
import { productApi } from "../../../entities/product";
import './ShopPage.scss';

// Skeleton Loader компонент
const ProductListSkeleton = () => (
    <div className="product-list-skeleton">
        {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="product-skeleton-item">
                <div className="skeleton-image"></div>
                <div className="skeleton-text-long"></div>
                <div className="skeleton-text-short"></div>
                <div className="skeleton-text-medium"></div>
            </div>
        ))}
    </div>
);

const FilterSkeleton = () => (
    <div className="filter-skeleton">
        <div className="skeleton-text-medium mb-3"></div>
        <div className="skeleton-text-long mb-2"></div>
        <div className="skeleton-text-short mb-2"></div>
        <div className="skeleton-text-medium mb-3"></div>
        <div className="skeleton-text-long mb-2"></div>
        <div className="skeleton-text-short mb-2"></div>
    </div>
);

const ShopPage = observer(() => {
    const { product } = useContext(Context);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(20);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [isPageLoading, setIsPageLoading] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const [currentFilters, setCurrentFilters] = useState({});
    const [selectedTypes, setSelectedTypes] = useState([]);

    // Мемоизированное значение общего количества страниц
    const totalPages = useMemo(() => 
        Math.ceil(product.totalCount / itemsPerPage), 
        [product.totalCount, itemsPerPage]
    );

    // Функция для применения фильтров с debounce эффектом
    const applyFilters = useCallback(async (filters, page = 1) => {
        try {
            setIsPageLoading(true);
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
        } finally {
            setIsPageLoading(false);
        }
    }, [itemsPerPage, product, navigate, location.pathname]);

    // Оптимизированная загрузка начальных данных с параллельными запросами
    const loadInitialData = useCallback(async () => {
        try {
            setIsInitialLoading(true);
            
            // Параллельная загрузка всех данных
            const [types, factories, products] = await Promise.all([
                filterApi.fetchTypes(),
                filterApi.fetchFactories(),
                productApi.fetchProducts(null, null, 1, itemsPerPage)
            ]);

            // Batch обновление состояния
            product.setTypes(types);
            product.setFactories(factories);
            product.setProducts(products.rows);
            product.setTotalCount(products.count);
        } catch (error) {
            console.error('Error fetching initial data:', error);
        } finally {
            setIsInitialLoading(false);
        }
    }, [itemsPerPage, product]);

    // Обработка URL-параметров и обновления страницы
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const selectedTypeId = params.get('selectedType');
        const selectedSubtypesParam = params.get('selectedSubtypes');
        const shouldApplyFilter = params.get('applyFilter') === 'true';

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
            if (params.toString()) {
                navigate(location.pathname, { replace: true });
            }
            loadInitialData();
        }
    }, [location.search, loadInitialData, applyFilters, navigate, location.pathname]);

    const handleFilterChange = useCallback(async (filteredProducts, filters) => {
        product.setProducts(filteredProducts.rows);
        product.setTotalCount(filteredProducts.count);
        setCurrentFilters(filters);
        setCurrentPage(1);
    }, [product]);

    const handleSelectedTypesChange = useCallback((types) => {
        setSelectedTypes(types);
    }, []);

    const handleSubtypeSelect = useCallback(async (subtypeIds) => {
        const newFilters = { ...currentFilters };
        
        if (!subtypeIds || subtypeIds.length === 0) {
            delete newFilters.selectedSubtypes;
        } else {
            newFilters.selectedSubtypes = subtypeIds;
        }
        
        await applyFilters(newFilters, 1);
    }, [currentFilters, applyFilters]);

    const handlePageChange = useCallback(async (page) => {
        // Smooth scroll to top
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        try {
            setIsPageLoading(true);
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
        } finally {
            setIsPageLoading(false);
        }
    }, [currentFilters, applyFilters, itemsPerPage, product]);

    return (
        <div className="container-fluid shop-page">
            <Row className="mt-2">
                <Col lg={2} md={4} sm={4} xs={12} className="filter-column">
                    <Suspense fallback={<FilterSkeleton />}>
                        {isInitialLoading ? (
                            <FilterSkeleton />
                        ) : (
                            <FilterForm 
                                onFilterChange={handleFilterChange} 
                                onSelectedTypesChange={handleSelectedTypesChange}
                            />
                        )}
                    </Suspense>
                </Col>
                <Col lg={10} md={8} sm={8} xs={12} className="product-column">
                    <Suspense fallback={<div className="text-center py-3"><Spinner animation="border" /></div>}>
                        {!isInitialLoading && (
                            <SubtypeFilter 
                                selectedTypes={selectedTypes}
                                currentFilters={currentFilters}
                                onSubtypeSelect={handleSubtypeSelect}
                            />
                        )}
                    </Suspense>
                    
                    <div className="product-list-container">
                        {isInitialLoading || isPageLoading ? (
                            <ProductListSkeleton />
                        ) : (
                            <Suspense fallback={<ProductListSkeleton />}>
                                <ProductList />
                            </Suspense>
                        )}
                    </div>
                    
                    {!isInitialLoading && totalPages > 1 && (
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