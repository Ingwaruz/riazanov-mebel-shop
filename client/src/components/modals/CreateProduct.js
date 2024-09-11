import React, { useContext, useEffect, useReducer, useCallback, useState } from 'react';
import { Button, Col, Dropdown, Form, Modal, Row, Spinner, Alert } from "react-bootstrap";
import { Context } from "../../index";
import { createProduct, fetchFactories, fetchTypes } from "../../http/productAPI";
import { observer } from "mobx-react-lite";

// Reducer для управления состоянием формы
const productReducer = (state, action) => {
    switch (action.type) {
        case 'SET_FIELD':
            return { ...state, [action.field]: action.payload };
        case 'ADD_INFO':
            return { ...state, info: [...state.info, { title: '', description: '', number: Date.now() }] };
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
            return { name: '', price: 0, file: null, info: [] };
        default:
            return state;
    }
};

const CreateProduct = observer(({ show, onHide }) => {
    const { product } = useContext(Context);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Инициализация состояния с помощью useReducer
    const [productData, dispatch] = useReducer(productReducer, {
        name: '',
        price: 0,
        file: null,
        info: []
    });

    // Загрузка данных (типы и фабрики) только при первой загрузке
    useEffect(() => {
        if (!product.types.length || !product.factories.length) {
            const fetchData = async () => {
                try {
                    setLoading(true);
                    const types = await fetchTypes();
                    const factories = await fetchFactories();
                    product.setTypes(types);
                    product.setFactories(factories);
                } catch (err) {
                    setError("Не удалось загрузить типы или фабрики.");
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        }
    }, [product]);

    const addInfo = useCallback(() => dispatch({ type: 'ADD_INFO' }), []);
    const removeInfo = useCallback(number => dispatch({ type: 'REMOVE_INFO', payload: number }), []);
    const changeInfo = useCallback((key, value, number) => dispatch({ type: 'CHANGE_INFO', key, value, payload: { number } }), []);

    const selectFile = useCallback((e) => {
        dispatch({ type: 'SET_FIELD', field: 'file', payload: e.target.files[0] });
    }, []);

    const addProduct = async () => {
        const { name, price, file, info } = productData;

        if (!name || !price || !file || !product.selectedFactory.id || !product.selectedType.id) {
            setError("Заполните все поля.");
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', `${price}`);
        formData.append('img', file);
        formData.append('factoryId', product.selectedFactory.id);
        formData.append('typeId', product.selectedType.id);
        formData.append('info', JSON.stringify(info));

        try {
            setLoading(true);
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
                        <Dropdown.Toggle>{product.selectedType.name || 'Выберите тип'}</Dropdown.Toggle>
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
                        className="mt-3"
                        type="file"
                        onChange={selectFile}
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
