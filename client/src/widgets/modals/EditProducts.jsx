import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button, Form, Container, Row, Col, Spinner } from 'react-bootstrap';
import { fetchProducts, deleteProduct } from '../../entities/product/api/productApi';
import { Context } from "../../index";
import { FilterForm } from '../../features/product-filters';
import EditProductForm from './EditProductForm';
import ButtonM2 from '../../shared/ui/buttons/button-m2';
import { Pagination } from '../../shared/ui/Pagination';
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
    const [initialLoad, setInitialLoad] = useState(true);

    // Загрузка товаров при открытии модального окна
    useEffect(() => {
        if (show) {
            // ВАЖНО: Принудительно загружаем товары при каждом открытии окна
            console.log('Модальное окно открыто, загружаем товары');
            loadProducts();
            setInitialLoad(false);
        }
    }, [show]);

    // Загрузка товаров при изменении страницы
    useEffect(() => {
        if (show && !initialLoad) {
            console.log('Изменилась страница, загружаем товары для страницы:', currentPage);
            loadProducts();
        }
    }, [currentPage]);

    // Очищаем поиск при закрытии окна
    useEffect(() => {
        if (!show) {
            setSearchQuery('');
            setSearchType('name');
            setCurrentPage(1);
            setFilters({});
        }
    }, [show]);
    
    // Обработка поиска - только когда пользователь нажимает на кнопку или Enter
    const handleSearchSubmit = (e) => {
        if (e) e.preventDefault();
        if (searchQuery.trim()) {
            console.log('Выполняем поиск по запросу:', searchQuery, 'тип поиска:', searchType);
            searchProducts();
        } else {
            // Если поле поиска пустое, возвращаемся к обычному списку товаров
            loadProducts();
        }
    };

    // Загрузка товаров с учетом фильтров и пагинации
    const loadProducts = async () => {
        setLoading(true);
        try {
            console.log('Загрузка товаров, страница:', currentPage, 'фильтры:', filters);
            
            // Корректно формируем параметры запроса
            const typeId = filters.typeId || null;
            const factoryId = filters.factoryId || null;
            const additionalParams = { ...filters };
            
            console.log('Запрос с параметрами:', { typeId, factoryId, currentPage, itemsPerPage, additionalParams });
            
            const data = await fetchProducts(
                typeId, 
                factoryId, 
                currentPage, 
                itemsPerPage, 
                additionalParams
            );
            
            if (data && data.rows) {
                console.log(`Загружено ${data.rows.length} товаров из ${data.count}`);
                product.setProducts(data.rows);
                product.setTotalCount(data.count);
            } else {
                console.warn('Данные не получены при загрузке товаров');
                product.setProducts([]);
                product.setTotalCount(0);
            }
        } catch (error) {
            console.error('Ошибка при загрузке товаров:', error);
            product.setProducts([]);
            product.setTotalCount(0);
        } finally {
            setLoading(false);
        }
    };

    // Функция поиска товаров - ИСПРАВЛЕНА ДЛЯ КОРРЕКТНОЙ РАБОТЫ
    const searchProducts = async () => {
        setLoading(true);
        try {
            console.log(`Поиск товаров: ${searchQuery}, тип поиска: ${searchType}`);
            
            // Подготавливаем параметры для поиска
            let searchParams = {};
            
            // Проверяем, является ли запрос числом при поиске по ID
            if (searchType === 'id' && !isNaN(parseInt(searchQuery))) {
                // Для поиска по ID используем прямой запрос к API
                searchParams = {
                    id: parseInt(searchQuery)
                };
            } else {
                // Поиск по имени - используем параметр search
                searchParams = {
                    search: searchQuery,
                    searchType: searchType
                };
            }
            
            console.log('Параметры поиска:', searchParams);
            
            // Отправляем запрос с параметрами поиска
            const data = await fetchProducts(
                null,   // typeId 
                null,   // factoryId
                1,      // страница всегда 1 при новом поиске
                itemsPerPage,
                searchParams
            );
            
            if (data && data.rows) {
                console.log(`Найдено ${data.rows.length} товаров`);
                product.setProducts(data.rows);
                product.setTotalCount(data.count);
            } else {
                console.log('Ничего не найдено');
                product.setProducts([]);
                product.setTotalCount(0);
            }
            
            // При новом поиске сбрасываем страницу на первую
            setCurrentPage(1);
        } catch (error) {
            console.error('Ошибка при поиске товаров:', error);
            product.setProducts([]);
            product.setTotalCount(0);
        } finally {
            setLoading(false);
        }
    };

    // Обработка изменения фильтров
    const handleFilterChange = (filteredProducts, newFilters) => {
        if (filteredProducts && filteredProducts.rows) {
            product.setProducts(filteredProducts.rows);
            product.setTotalCount(filteredProducts.count);
            setFilters(newFilters);
            setCurrentPage(1);
        }
    };

    // Обработка изменения страницы
    const handlePageChange = (page) => {
        console.log('Переключение на страницу:', page);
        setCurrentPage(page);
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    // Обработка выбора товара для редактирования
    const handleEditProduct = (selectedProduct) => {
        console.log('Выбран товар для редактирования:', selectedProduct);
        // ВАЖНО: Обязательно преобразуем ID в число перед передачей в форму редактирования
        if (selectedProduct && selectedProduct.id) {
            selectedProduct.id = Number(selectedProduct.id);
            console.log('ID товара преобразован в число:', selectedProduct.id);
        }
        setSelectedProduct(selectedProduct);
        setEditing(true);
    };

    // Обработка завершения редактирования
    const handleEditComplete = () => {
        setEditing(false);
        setSelectedProduct(null);
        // ВАЖНО: Обновляем список товаров после редактирования
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
                            <Form onSubmit={handleSearchSubmit}>
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
                                        type="submit"
                                        style={{ marginLeft: '10px' }}
                                    >
                                        Поиск
                                    </Button>
                                </Form.Group>
                            </Form>
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
                            ) : product.products && product.products.length > 0 ? (
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
                            ) : (
                                <div className="text-center my-5">
                                    <p>Товары не найдены</p>
                                    <Button 
                                        variant="outline-primary" 
                                        onClick={loadProducts}
                                    >
                                        Загрузить все товары
                                    </Button>
                                </div>
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