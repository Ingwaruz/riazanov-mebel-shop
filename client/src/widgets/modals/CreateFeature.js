import React, {useContext, useState} from 'react';
import {Modal, Form, Dropdown} from "react-bootstrap";
import {Context} from "../../index";
import {createFeature} from "../../processes/productAPI";
import ButtonM1 from "../../shared/ui/buttons/button-m1";
import ButtonM2 from "../../shared/ui/buttons/button-m2";

const CreateFeature = ({show, onHide}) => {
    const {product} = useContext(Context);
    const [name, setName] = useState('');
    const [selectedType, setSelectedType] = useState(null);
    const [selectedFactory, setSelectedFactory] = useState(null);

    const addFeature = () => {
        if (!selectedType || !selectedFactory) {
            alert('Выберите тип и производителя');
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('typeId', selectedType.id);
        formData.append('factoryId', selectedFactory.id);

        createFeature(formData).then(data => {
            setName('');
            setSelectedType(null);
            setSelectedFactory(null);
            onHide();
        });
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Добавить характеристику</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Dropdown className="mt-2 mb-2">
                        <Dropdown.Toggle>{selectedType?.name || "Выберите тип"}</Dropdown.Toggle>
                        <Dropdown.Menu>
                            {product.types.map(type =>
                                <Dropdown.Item
                                    onClick={() => setSelectedType(type)}
                                    key={type.id}
                                >
                                    {type.name}
                                </Dropdown.Item>
                            )}
                        </Dropdown.Menu>
                    </Dropdown>
                    <Dropdown className="mt-2 mb-2">
                        <Dropdown.Toggle>{selectedFactory?.name || "Выберите производителя"}</Dropdown.Toggle>
                        <Dropdown.Menu>
                            {product.factories.map(factory =>
                                <Dropdown.Item
                                    onClick={() => setSelectedFactory(factory)}
                                    key={factory.id}
                                >
                                    {factory.name}
                                </Dropdown.Item>
                            )}
                        </Dropdown.Menu>
                    </Dropdown>
                    <Form.Control
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Введите название характеристики"
                    />
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <ButtonM1 onClick={onHide}>Отмена</ButtonM1>
                <ButtonM2 onClick={addFeature}>Добавить</ButtonM2>
            </Modal.Footer>
        </Modal>
    );
};

export default CreateFeature; 