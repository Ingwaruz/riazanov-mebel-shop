import React, {useState} from 'react';
import {Container} from "react-bootstrap";
import CreateFactory from "../widgets/modals/CreateFactory";
import CreateProduct from "../widgets/modals/CreateProduct";
import CreateType from "../widgets/modals/CreateType";
import CreateCollection from "../widgets/modals/CreateCollection";
import CreateSubtype from "../widgets/modals/CreateSubtype";
import ButtonM2 from "../shared/ui/buttons/button-m1";

const Admin = () => {
    const [factoryVisible, setFactoryVisible] = useState(false)
    const [typeVisible, setTypeVisible] = useState(false)
    const [subtypeVisible, setSubtypeVisible] = useState(false)
    const [collectionVisible, setCollectionVisible] = useState(false)
    const [productVisible, setProductVisible] = useState(false)

    return (
        <Container className={'d-flex flex-column mt-4'}>

            <ButtonM2
                text="Добавить производителя"
                //height={{height: '100px'}}
                onClick={() => setFactoryVisible(true)}
            />
            <ButtonM2
                text="Добавить тип"
                onClick={() => setTypeVisible(true)}
            />
            <ButtonM2
                text="Добавить подтип"
                onClick={() => setSubtypeVisible(true)}
            />
            <ButtonM2
                text="Добавить коллекцию"
                onClick={() => setCollectionVisible(true)}
            />
            <ButtonM2
                text="Добавить товар"
                onClick={() => setProductVisible(true)}
            />

            <CreateType show={typeVisible} onHide={() => setTypeVisible(false)}/>
            <CreateSubtype show={subtypeVisible} onHide={() => setSubtypeVisible(false)}/>
            <CreateFactory show={factoryVisible} onHide={() => setFactoryVisible(false)}/>
            <CreateCollection show={collectionVisible} onHide={() => setCollectionVisible(false)}/>
            <CreateProduct show={productVisible} onHide={() => setProductVisible(false)}/>
        </Container>
    );
};

export default Admin;