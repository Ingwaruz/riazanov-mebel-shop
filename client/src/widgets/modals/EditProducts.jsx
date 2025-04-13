import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button, Form, Container, Row, Col, Spinner } from 'react-bootstrap';
import { fetchProducts, deleteProduct } from '../../entities/product/api/productApi';
import { Context } from "../../index";
import { FilterForm } from '../../features/product-filters';
import EditProductForm from './EditProductForm';
import ButtonM2 from '../../shared/ui/buttons/button-m2';
import { Pagination } from '../../shared/ui/pagination';
import AdminProductList from './AdminProductList';
import './EditProducts.scss';

const EditProducts = ({ show, onHide }) => {
    const { product } = useContext(Context);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchType, setSearchType] = useState('name');
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState({});
    const [itemsPerPage] = useState(16);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [editing, setEditing] = useState(false);

    // Загрузка товаров при открытии модального окна или изменении страницы
    useEffect(() => {
        if (show) {
            loadProducts();
        }
    }, [show, currentPage]);

    // Обработка поиска при изменении строки поиска
    useEffect(() => {
        if (searchQuery && show) {
            const delayDebounceFn = setTimeout(() => {
                handleSearch();
            }, 500);
            return () => clearTimeout(delayDebounceFn);
        } else if (show) {
            loadProducts();
        }
    }, [searchQuery, searchType, show]);

    // Загрузка товаров с учетом фильтров и пагинации
    const loadProducts = async () => {
        setLoading(true);
        try {
            const filtersWithPagination = {
                ...filters,
                page: currentPage,
                limit: itemsPerPage
            };
            const data = await fetchProducts(filtersWithPagination);
            product.setProducts(data.rows);
            product.setTotalCount(data.count);
        } catch (error) {
            console.error('Ошибка при загрузке товаров:', error);
        } finally {
            setLoading(false);
        }
    };

    // Обработка поиска
    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        
        setLoading(true);
        try {
            // Создаем объект с параметрами поиска
            const searchParams = {
                search: searchQuery,
                searchType: searchType,
                page: 1,
                limit: itemsPerPage
            };
            
            const data = await fetchProducts(null, null, 1, itemsPerPage, searchParams);
            product.setProducts(data.rows);
            product.setTotalCount(data.count);
            setCurrentPage(1);
        } catch (error) {
            console.error('Ошибка при поиске товаров:', error);
        } finally {
            setLoading(false);
        }
    };

    // Обработка изменения фильтров
    const handleFilterChange = (filteredProducts, newFilters) => {
        product.setProducts(filteredProducts.rows);
        product.setTotalCount(filteredProducts.count);
        setFilters(newFilters);
        setCurrentPage(1);
    };

    // Обработка изменения страницы
    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    // Обработка выбора товара для редактирования
    const handleEditProduct = (selectedProduct) => {
        setSelectedProduct(selectedProduct);
        setEditing(true);
    };

    // Обработка завершения редактирования
    const handleEditComplete = () => {
        setEditing(false);
        setSelectedProduct(null);
        loadProducts();
    };

    // Если выбран товар для редактирования, показываем форму редактирования
    if (editing && selectedProduct) {
        return (
            <EditProductForm 
                show={show} 
                onHide={() => setEditing(false)} 
                product={selectedProduct} 
                onComplete={handleEditComplete}
            />
        );
    }

    return (
        <Modal
            show={show}
            onHide={onHide}
            size="xl"
            centered
            dialogClassName="edit-products-modal"
        >
            <Modal.Header closeButton>
                <Modal.Title>Редактирование товаров</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container fluid>
                    <Row className="mb-3">
                        <Col md={8}>
                            <Form.Group className="d-flex">
                                <Form.Control
                                    type="text"
                                    placeholder="Поиск товаров..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <Form.Select 
                                    value={searchType}
                                    onChange={(e) => setSearchType(e.target.value)}
                                    style={{ width: '120px', marginLeft: '10px' }}
                                >
                                    <option value="name">По названию</option>
                                    <option value="id">По ID</option>
                                </Form.Select>
                                <Button 
                                    variant="primary" 
                                    onClick={handleSearch}
                                    style={{ marginLeft: '10px' }}
                                >
                                    Поиск
                                </Button>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={3}>
                            <FilterForm onFilterChange={handleFilterChange} />
                        </Col>
                        <Col md={9}>
                            {loading ? (
                                <div className="text-center my-5">
                                    <Spinner animation="border" />
                                </div>
                            ) : (
                                <>
                                    <AdminProductList onProductClick={handleEditProduct} />
                                    {product.totalCount > 0 && product.totalCount > itemsPerPage && (
                                        <div className="d-flex justify-content-center mt-4">
                                            <Pagination
                                                currentPage={currentPage}
                                                totalPages={Math.ceil(product.totalCount / itemsPerPage)}
                                                onPageChange={handlePageChange}
                                            />
                                        </div>
                                    )}
                                </>
                            )}
                        </Col>
                    </Row>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Закрыть
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EditProducts; 