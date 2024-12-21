import React, {useContext, useState, useEffect} from 'react';
import {Modal, Form, Dropdown, ListGroup} from "react-bootstrap";
import {Context} from "../../index";
import {createFeature, searchFeatures} from "../../processes/productAPI";
import ButtonM1 from "../../shared/ui/buttons/button-m1";
import ButtonM2 from "../../shared/ui/buttons/button-m2";
import '../../app/styles/commonStyles.scss';

const CreateFeature = ({show, onHide}) => {
    const {product} = useContext(Context);
    const [name, setName] = useState('');
    const [selectedType, setSelectedType] = useState(null);
    const [selectedFactory, setSelectedFactory] = useState(null);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    useEffect(() => {
        const searchTimer = setTimeout(async () => {
            if (name.trim().length >= 2) {
                try {
                    const results = await searchFeatures(name.trim());
                    setSuggestions(results);
                    setShowSuggestions(true);
                } catch (error) {
                    console.error('Error loading suggestions:', error);
                }
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        }, 300);

        return () => clearTimeout(searchTimer);
    }, [name]);

    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const handleSuggestionClick = (suggestion) => {
        setName(suggestion.name);
        setSuggestions([]);
        setShowSuggestions(false);
    };

    const addFeature = async () => {
        try {
            if (!selectedType?.id || !selectedFactory?.id || !name.trim()) {
                alert('Заполните все поля');
                return;
            }

            const featureData = {
                name: name.trim(),
                typeId: selectedType.id,
                factoryId: selectedFactory.id
            };

            const result = await createFeature(featureData);
            console.log('Created feature:', result);
            
            setName('');
            setSelectedType(null);
            setSelectedFactory(null);
            setSuggestions([]);
            onHide();
        } catch (error) {
            console.error('Error creating feature:', error);
            alert(error.response?.data?.message || 'Произошла ошибка при создании характеристики');
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Добавить характеристику</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Dropdown className="mt-2 mb-2">
                        <Dropdown.Toggle
                            className="border-main_color bg-main_color_hover hover-item--main_color"
                        >
                            {selectedType?.name || "Выберите тип"}
                        </Dropdown.Toggle>
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
                        <Dropdown.Toggle
                            className="border-main_color bg-main_color_hover hover-item--main_color"
                        >
                            {selectedFactory?.name || "Выберите производителя"}
                        </Dropdown.Toggle>
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
                        onChange={handleNameChange}
                        placeholder="Введите название характеристики"
                        className="mt-3"
                    />
                    {showSuggestions && suggestions.length > 0 && (
                        <ListGroup className="mt-2">
                            {suggestions.map(suggestion => (
                                <ListGroup.Item
                                    key={suggestion.id}
                                    action
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    className="hover-item--main_color"
                                >
                                    {suggestion.name}
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <ButtonM2 onClick={onHide} text="Отмена" />
                <ButtonM2 onClick={addFeature} text="Добавить" />
            </Modal.Footer>
        </Modal>
    );
};

export default CreateFeature; 