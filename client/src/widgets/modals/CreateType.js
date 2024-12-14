import React, {useState} from 'react';
import {Button, Form, Modal} from "react-bootstrap";
import {createType} from "../../processes/productAPI";
import ButtonM1 from "../../shared/ui/buttons/button-m1";
import ButtonM2 from "../../shared/ui/buttons/button-m2";

const CreateType = ({show, onHide}) => {

    const [value, setValue] = useState('')
    const addType = () => {
        createType({name: value}).then(data => {
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
                    Добавить тип
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Control
                        value={value}
                        onChange={e => setValue(e.target.value)}
                        placeholder={'Введите название типа товара...'}
                    />
                </Form>
            </Modal.Body>
            <Modal.Footer>
                {/*<Button variant={'outline-danger'} onClick={onHide}>Закрыть</Button>*/}
                {/*<Button variant={'outline-success'} onClick={addType}>Добавить</Button>*/}
                <ButtonM2 text="Добавить" onClick={addType}/>
            </Modal.Footer>
        </Modal>
    );
};

export default CreateType;