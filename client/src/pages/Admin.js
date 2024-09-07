import React, {useState} from 'react';
import {Button, Container} from "react-bootstrap";
import CreateFactory from "../components/modals/CreateFactory";
import CreateProduct from "../components/modals/CreateProduct";
import CreateType from "../components/modals/CreateType";

const Admin = () => {
    const [factoryVisible, setFactoryVisible] = useState(false)
    const [typeVisible, setTypeVisible] = useState(false)
    const [productVisible, setProductVisible] = useState(false)

    return (
        <Container className={'d-flex flex-column'}>
            <Button
                className={'mt-4 p-3 bg-color-white border-radius-0 border-color-gray color-black hover-item--lightgray m-text'}
                onClick={() => setFactoryVisible(true)}
            >
                Добавить производителя
            </Button>
            <Button
                className={'mt-4 p-3 bg-color-white border-radius-0 border-color-gray color-black hover-item--lightgray m-text'}
                onClick={() => setTypeVisible(true)}
            >
                Добавить тип
            </Button>
            <Button
                className={'mt-4 p-3 bg-color-white border-radius-0 border-color-gray color-black hover-item--lightgray m-text'}
                onClick={() => setProductVisible(true)}
            >
                Добавить товар
            </Button>
            <CreateFactory show={factoryVisible} onHide={() => setFactoryVisible(false)}/>
            <CreateProduct show={productVisible} onHide={() => setProductVisible(false)}/>
            <CreateType show={typeVisible} onHide={() => setTypeVisible(false)}/>
        </Container>
    );
};

export default Admin;