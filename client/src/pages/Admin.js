import React, {useState} from 'react';
import {Button, Container} from "react-bootstrap";
import CreateFactory from "../widgets/modals/CreateFactory";
import CreateProduct from "../widgets/modals/CreateProduct";
import CreateType from "../widgets/modals/CreateType";
import CreateCollection from "../widgets/modals/CreateCollection";

const Admin = () => {
    const [factoryVisible, setFactoryVisible] = useState(false)
    const [typeVisible, setTypeVisible] = useState(false)
    const [collectionVisible, setCollectionVisible] = useState(false)
    const [productVisible, setProductVisible] = useState(false)

    return (
        <Container className={'d-flex flex-column'}>
            <Button
                className={'mt-4 p-3 bg-color_white border-radius-0 border-main_color_active main_font_color hover-item--lightgray m-text'}
                onClick={() => setFactoryVisible(true)}
            >
                Добавить производителя
            </Button>
            <Button
                className={'mt-4 p-3 bg-color_white border-radius-0 border-main_color main_font_color hover-item--lightgray m-text'}
                onClick={() => setTypeVisible(true)}
            >
                Добавить тип
            </Button>
            <Button
                className={'mt-4 p-3 bg-color_white border-radius-0 border-main_color main_font_color hover-item--lightgray m-text'}
                onClick={() => setCollectionVisible(true)}
            >
                Добавить коллекцию
            </Button>
            <Button
                className={'mt-4 p-3 bg-color_white border-radius-0 border-main_color main_font_color hover-item--lightgray m-text'}
                onClick={() => setProductVisible(true)}
            >
                Добавить товар
            </Button>
            <CreateType show={typeVisible} onHide={() => setTypeVisible(false)}/>
            <CreateFactory show={factoryVisible} onHide={() => setFactoryVisible(false)}/>
            <CreateCollection show={collectionVisible} onHide={() => setCollectionVisible(false)}/>
            <CreateProduct show={productVisible} onHide={() => setProductVisible(false)}/>
        </Container>
    );
};

export default Admin;