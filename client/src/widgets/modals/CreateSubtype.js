import React, {useContext, useEffect, useState} from 'react';
import {Button, Dropdown, Form, Modal} from "react-bootstrap";
import {Context} from "../../index";
import {createSubtype, fetchTypes} from "../../entities/product/api/productApi";
import {observer} from "mobx-react-lite";
import ButtonM1 from "../../shared/ui/buttons/button-m1";
import ButtonM2 from "../../shared/ui/buttons/button-m2";

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
                <Dropdown className="mt-2 mb-2">
                    <Dropdown.Toggle variant="success">
                        {selectedType ? selectedType.name : "Выберите тип"}
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
                <Form.Control
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder={"Введите название подтипа"}
                    className="mt-3"
                />
            </Modal.Body>
            <Modal.Footer>
                <ButtonM2 text="Добавить" onClick={addSubtype}/>
            </Modal.Footer>
        </Modal>
    );
});

export default CreateSubtype; 