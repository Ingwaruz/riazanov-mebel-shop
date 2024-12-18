import React, {useContext, useEffect, useState} from 'react';
import {Button, Dropdown, Form, Modal} from "react-bootstrap";
import {Context} from "../../../index";
import {createSubtype, fetchTypes} from "../../../processes/productAPI";
import {observer} from "mobx-react-lite";

const CreateSubtype = observer(({show, onHide}) => {
    const {product} = useContext(Context)
    const [name, setName] = useState('')
    const [selectedType, setSelectedType] = useState(null)

    useEffect(() => {
        fetchTypes().then(data => product.setTypes(data))
    }, [])

    const addSubtype = () => {
        if (!selectedType) {
            alert('Выберите тип товара')
            return
        }
        
        const formData = new FormData()
        formData.append('name', name)
        formData.append('typeId', selectedType.id)
        createSubtype(formData).then(data => {
            setName('')
            setSelectedType(null)
            onHide()
        })
    }

    return (
        <Modal
            show={show}
            onHide={onHide}
            size="lg"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Добавить подтип
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Dropdown className="mt-2 mb-2">
                        <Dropdown.Toggle>{selectedType ? selectedType.name : "Выберите тип"}</Dropdown.Toggle>
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
                    <Form.Control
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder={"Введите название подтипа"}
                    />
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-danger" onClick={onHide}>Закрыть</Button>
                <Button variant="outline-success" onClick={addSubtype}>Добавить</Button>
            </Modal.Footer>
        </Modal>
    );
});

export default CreateSubtype; 