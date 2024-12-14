import React, { useState, useEffect } from 'react';
import { Button, Dropdown, Form, Modal, Spinner, Alert } from "react-bootstrap";
import { createCollection, fetchFactories } from "../../processes/productAPI";
import "../../app/styles/colors.scss";
import ButtonM2 from "../../shared/ui/buttons/button-m2";

const CreateCollection = ({ show, onHide }) => {
    const [value, setValue] = useState('');
    const [factories, setFactories] = useState([]);
    const [selectedFactory, setSelectedFactory] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadFactories = async () => {
            try {
                setLoading(true);
                const fetchedFactories = await fetchFactories();
                setFactories(fetchedFactories);
            } catch (err) {
                setError("Ошибка загрузки фабрик.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadFactories();
    }, []);

    const addCollection = async () => {
        if (!value || !selectedFactory) {
            setError("Введите название коллекции и выберите фабрику.");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const formData = new FormData();
            formData.append('name', value);
            formData.append('factoryId', selectedFactory.id);

            await createCollection(formData);
            setValue('');
            setSelectedFactory(null);
            onHide();
        } catch (err) {
            setError("Ошибка при создании коллекции.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };


    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">Добавить коллекцию</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loading && <Spinner animation="border" />}
                {error && <Alert variant="danger">{error}</Alert>}
                <Form>
                    <Form.Control
                        value={value}
                        onChange={e => setValue(e.target.value)}
                        placeholder={'Введите название коллекции...'}
                        className="mb-3"
                    />
                    <Dropdown className="mb-2 color-white">
                        <Dropdown.Toggle className="mb-2 border-main_color bg-main_color_hover hover-item--main_color">
                            {selectedFactory?.name || 'Выберите производителя'}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {factories.map(factory => (
                                <Dropdown.Item
                                    onClick={() => setSelectedFactory(factory)}
                                    key={factory.id}
                                >
                                    {factory.name}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                {/*<Button variant="outline-danger" onClick={onHide}>Закрыть</Button>*/}
                {/*<Button variant="outline-success" onClick={addCollection} disabled={loading}>Добавить</Button>*/}
                <ButtonM2 text="Добавить" onClick={addCollection}/>
            </Modal.Footer>
        </Modal>
    );
};

export default CreateCollection;
