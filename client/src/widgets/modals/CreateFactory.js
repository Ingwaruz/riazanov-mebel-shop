import React, {useState} from 'react';
import {Button, Form, Modal} from "react-bootstrap";
import {createFactory} from "../../processes/productAPI";

const CreateFactory = ({show, onHide}) => {

    const [value, setValue] = useState('')
    const addFactory = () => {
        createFactory({name: value}).then(data => {
            setValue('')
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
                    Добавить производителя
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Control
                        value={value}
                        onChange={e => setValue(e.target.value)}
                        placeholder={'Введите производителя...'}
                    />
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant={'outline-danger'} onClick={onHide}>Закрыть</Button>
                <Button variant={'outline-success'} onClick={addFactory}>Добавить</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CreateFactory;