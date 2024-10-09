import React, { useContext, useEffect, useReducer, useCallback, useState } from 'react';
import { Button, Col, Dropdown, Form, Modal, Row, Spinner, Alert } from "react-bootstrap";
import { Context } from "../../index";
import { createProduct, fetchFactories, fetchTypes, fetchCollections } from "../../http/productAPI";
import { observer } from "mobx-react-lite";
import '../../styles/commonStyles.scss';

// Reducer для управления состоянием формы
const productReducer = (state, action) => {
    switch (action.type) {
        case 'SET_FIELD':
            return { ...state, [action.field]: action.payload };
        case 'ADD_INFO':
            return { ...state, info: [...state.info, { title: '', description: '', width: 0, depth: 0, height: 0, number: Date.now() }] };
        case 'REMOVE_INFO':
            return { ...state, info: state.info.filter(i => i.number !== action.payload) };
        case 'CHANGE_INFO':
            return {
                ...state,
                info: state.info.map(i => i.number === action.payload.number
                    ? { ...i, [action.key]: action.value }
                    : i)
            };
        case 'RESET':
            return { name: '', price: 0, width: 0, depth: 0, height: 0, files: [], info: [] };
        default:
            return state;
    }
};

const CreateProduct = observer(({ show, onHide }) => {
    const { product } = useContext(Context);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filteredCollections, setFilteredCollections] = useState([]);

    // Инициализация состояния с помощью useReducer
    const [productData, dispatch] = useReducer(productReducer, {
        name: '',
        price: '',
        width: '',
        depth: '',
        height: '',
        files: [],  // Массив для загрузки нескольких файлов
        info: [],
    });

    // Загрузка данных (типы и фабрики) только при первой загрузке
    useEffect(() => {
        if (!product.types.length || !product.factories.length || !product.collections.length) {
            const fetchData = async () => {
                try {
                    setLoading(true);
                    const types = await fetchTypes();
                    const factories = await fetchFactories();
                    const collections = await fetchCollections(); // Получаем коллекции
                    product.setTypes(types);
                    product.setFactories(factories);
                    product.setCollections(collections); // Сохраняем коллекции в контекст
                } catch (err) {
                    setError("Не удалось загрузить данные.");
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        }
    }, [product]);

    // Фильтрация по коллекциям
    useEffect(() => {
        if (product.selectedFactory) {
            const relatedCollections = product.collections.filter(
                collection => collection.factoryId === product.selectedFactory.id
            );
            setFilteredCollections(relatedCollections); // обновляем отфильтрованные коллекции
        } else {
            setFilteredCollections([]); // сброс фильтра
        }
    }, [product.selectedFactory, product.collections]);

    const addInfo = useCallback(() => dispatch({ type: 'ADD_INFO' }), []);
    const removeInfo = useCallback(number => dispatch({ type: 'REMOVE_INFO', payload: number }), []);
    const changeInfo = useCallback((key, value, number) => dispatch({ type: 'CHANGE_INFO', key, value, payload: { number } }), []);

    // Обработка выбора файлов
    const selectFiles = useCallback((e) => {
        const files = Array.from(e.target.files);
        dispatch({ type: 'SET_FIELD', field: 'files', payload: files });
    }, []);

    const addProduct = async () => {
        const { name, price, width, depth, height, files, info } = productData;

        if (!name || !price || !width || !depth || !height || !files.length || !product.selectedFactory.id || !product.selectedType.id || !product.selectedCollection.id ) {
            setError("Заполните все поля.");
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', `${price}`);
        formData.append('width', `${width}`);
        formData.append('depth', `${depth}`);
        formData.append('height', `${height}`);
        formData.append('factoryId', product.selectedFactory.id);
        formData.append('typeId', product.selectedType.id);
        formData.append('collectionId', product.selectedCollection.id);
        formData.append('info', JSON.stringify(info));

        // Добавление всех изображений в formData
        files.forEach((file, index) => {
            formData.append(`images`, file);
        });

        try {
            setLoading(true);
            setError(null);
            await createProduct(formData);
            onHide();
            dispatch({ type: 'RESET' });
        } catch (err) {
            setError("Ошибка при создании продукта.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Добавить товар</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loading && <Spinner animation="border" />}
                {error && <Alert variant="danger">{error}</Alert>}
                <Form>
                    <Dropdown className="mt-2 mb-2">
                        <Dropdown.Toggle>{product.selectedType.name || 'Выберите тип товара'}</Dropdown.Toggle>
                        <Dropdown.Menu>
                            {product.types.map(type => (
                                <Dropdown.Item
                                    onClick={() => product.setSelectedType(type)}
                                    key={type.id}
                                >
                                    {type.name}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                    <Dropdown className="mt-2 mb-2">
                        <Dropdown.Toggle>{product.selectedFactory.name || 'Выберите производителя'}</Dropdown.Toggle>
                        <Dropdown.Menu>
                            {product.factories.map(factory => (
                                <Dropdown.Item
                                    onClick={() => product.setSelectedFactory(factory)}
                                    key={factory.id}
                                >
                                    {factory.name}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                    <Dropdown className="mt-2 mb-2">
                        <Dropdown.Toggle disabled={!product.selectedFactory}>{product.selectedCollection?.name || 'Выберите коллекцию'}</Dropdown.Toggle>
                        <Dropdown.Menu>
                            {filteredCollections.map(collection => (
                                <Dropdown.Item
                                    onClick={() => product.setSelectedCollection(collection)}
                                    key={collection.id}
                                >
                                    {collection.name}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                    <Form.Control
                        value={productData.name}
                        onChange={e => dispatch({ type: 'SET_FIELD', field: 'name', payload: e.target.value })}
                        className="mt-3"
                        placeholder="Введите название товара"
                    />
                    <Form.Control
                        value={productData.price}
                        onChange={e => dispatch({ type: 'SET_FIELD', field: 'price', payload: Number(e.target.value) })}
                        className="mt-3"
                        placeholder="Введите стоимость товара (От ... руб.)"
                        type="number"
                    />
                    <Form.Control
                        value={productData.width}
                        onChange={e => dispatch({ type: 'SET_FIELD', field: 'width', payload: Number(e.target.value) })}
                        className="mt-3"
                        placeholder="Введите ширину товара (мм)"
                        type="number"
                    />
                    <Form.Control
                        value={productData.depth}
                        onChange={e => dispatch({ type: 'SET_FIELD', field: 'depth', payload: Number(e.target.value) })}
                        className="mt-3"
                        placeholder="Введите глубину товара (мм)"
                        type="number"
                    />
                    <Form.Control
                        value={productData.height}
                        onChange={e => dispatch({ type: 'SET_FIELD', field: 'height', payload: Number(e.target.value) })}
                        className="mt-3"
                        placeholder="Введите высоту товара (мм)"
                        type="number"
                    />
                    <Form.Control
                        className="mt-3"
                        type="file"
                        multiple
                        onChange={selectFiles}
                    />
                    <hr />
                    <Button variant="outline-dark" onClick={addInfo}>
                        Добавить новое свойство
                    </Button>
                    {productData.info.map(i => (
                        <Row className="mt-4" key={i.number}>
                            <Col md={4}>
                                <Form.Control
                                    value={i.title}
                                    onChange={e => changeInfo('title', e.target.value, i.number)}
                                    placeholder="Введите название характеристики"
                                />
                            </Col>
                            <Col md={4}>
                                <Form.Control
                                    value={i.description}
                                    onChange={e => changeInfo('description', e.target.value, i.number)}
                                    placeholder="Введите описание характеристики"
                                />
                            </Col>
                            <Col md={4}>
                                <Button
                                    onClick={() => removeInfo(i.number)}
                                    variant="outline-danger"
                                >
                                    Удалить
                                </Button>
                            </Col>
                        </Row>
                    ))}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-danger" onClick={onHide}>Закрыть</Button>
                <Button variant="outline-success" onClick={addProduct} disabled={loading}>Добавить</Button>
            </Modal.Footer>
        </Modal>
    );
});

export default CreateProduct;
