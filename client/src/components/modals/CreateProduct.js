import React, {useContext, useEffect, useState, useCallback} from 'react';
import {Button, Col, Dropdown, Form, Modal, Row} from "react-bootstrap";
import {Context} from "../../index";
import {createProduct, fetchFactories, fetchTypes} from "../../http/productAPI";
import {observer} from "mobx-react-lite";

const CreateProduct = observer(({show, onHide}) => {
    const {product} = useContext(Context);
    const [productData, setProductData] = useState({
        name: '',
        price: 0,
        file: null,
        info: []
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const types = await fetchTypes();
                const factories = await fetchFactories();
                product.setTypes(types);
                product.setFactories(factories);
            } catch (error) {
                console.error("Failed to fetch types or factories", error);
            }
        };
        fetchData();
    }, []);

    const addInfo = useCallback(() => {
        setProductData(prevState => ({
            ...prevState,
            info: [...prevState.info, {title: '', description: '', number: Date.now()}]
        }));
    }, []);

    const removeInfo = useCallback((number) => {
        setProductData(prevState => ({
            ...prevState,
            info: prevState.info.filter(i => i.number !== number)
        }));
    }, []);

    const changeInfo = useCallback((key, value, number) => {
        setProductData(prevState => ({
            ...prevState,
            info: prevState.info.map(i => i.number === number ? {...i, [key]: value} : i)
        }));
    }, []);

    const selectFile = useCallback((e) => {
        setProductData(prevState => ({
            ...prevState,
            file: e.target.files[0]
        }));
    }, []);

    const addProduct = async () => {
        const {name, price, file, info} = productData;
        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', `${price}`);
        formData.append('img', file);
        formData.append('factoryId', product.selectedFactory.id);
        formData.append('typeId', product.selectedType.id);
        formData.append('info', JSON.stringify(info));

        try {
            await createProduct(formData);
            onHide();
        } catch (error) {
            console.error("Failed to create product", error);
        }
    };

    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Добавить товар
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Dropdown className="mt-2 mb-2">
                        <Dropdown.Toggle>{product.selectedType.name || 'Выберите тип'}</Dropdown.Toggle>
                        <Dropdown.Menu>
                            {product.types.map(type =>
                                <Dropdown.Item
                                    onClick={() => product.setSelectedType(type)}
                                    key={type.id}
                                >
                                    {type.name}
                                </Dropdown.Item>
                            )}
                        </Dropdown.Menu>
                    </Dropdown>
                    <Dropdown>
                        <Dropdown.Toggle>{product.selectedFactory.name || 'Выберите производителя'}</Dropdown.Toggle>
                        <Dropdown.Menu>
                            {product.factories.map(factory =>
                                <Dropdown.Item
                                    onClick={() => product.setSelectedFactory(factory)}
                                    key={factory.id}
                                >
                                    {factory.name}
                                </Dropdown.Item>
                            )}
                        </Dropdown.Menu>
                    </Dropdown>
                    <Form.Control
                        value={productData.name}
                        onChange={e => setProductData(prevState => ({...prevState, name: e.target.value}))}
                        className="mt-3"
                        placeholder="Введите название товара"
                    />
                    <Form.Control
                        value={productData.price}
                        onChange={e => setProductData(prevState => ({...prevState, price: Number(e.target.value)}))}
                        className="mt-3"
                        placeholder="Введите стоимость товара (От ... руб.)"
                        type="number"
                    />
                    <Form.Control
                        className="mt-3"
                        type="file"
                        onChange={selectFile}
                    />
                    <hr/>
                    <Button variant="outline-dark" onClick={addInfo}>
                        Добавить новое свойство
                    </Button>
                    {productData.info.map(i =>
                        <Row className="mt-4" key={i.number}>
                            <Col md={4}>
                                <Form.Control
                                    value={i.title}
                                    onChange={(e) => changeInfo('title', e.target.value, i.number)}
                                    placeholder="Введите название характеристики"
                                />
                            </Col>
                            <Col md={4}>
                                <Form.Control
                                    value={i.description}
                                    onChange={(e) => changeInfo('description', e.target.value, i.number)}
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
                    )}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-danger" onClick={onHide}>Закрыть</Button>
                <Button variant="outline-success" onClick={addProduct}>Добавить</Button>
            </Modal.Footer>
        </Modal>
    );
});

export default CreateProduct;