import React, {useState} from 'react';
import {Container} from "react-bootstrap";
import CreateFactory from "../widgets/modals/CreateFactory";
import CreateProduct from "../widgets/modals/CreateProduct";
import CreateType from "../widgets/modals/CreateType";
import CreateCollection from "../widgets/modals/CreateCollection";
import CreateSubtype from "../widgets/modals/CreateSubtype";
import ButtonM2 from "../shared/ui/buttons/button-m1";
import ImportProducts from "../widgets/modals/ImportProducts";
import CreateFeature from "../widgets/modals/CreateFeature";
import EditProducts from "../widgets/modals/EditProducts";

const Admin = () => {
    const [factoryVisible, setFactoryVisible] = useState(false)
    const [typeVisible, setTypeVisible] = useState(false)
    const [subtypeVisible, setSubtypeVisible] = useState(false)
    const [collectionVisible, setCollectionVisible] = useState(false)
    const [productVisible, setProductVisible] = useState(false)
    const [importVisible, setImportVisible] = useState(false)
    const [featureVisible, setFeatureVisible] = useState(false)
    const [editProductsVisible, setEditProductsVisible] = useState(false)

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
            <ButtonM2
                text="Редактировать товары"
                onClick={() => setEditProductsVisible(true)}
            />
            <ButtonM2
                text="Импортировать товары"
                onClick={() => setImportVisible(true)}
            />
            <ButtonM2
                text="Добавить характеристику"
                onClick={() => setFeatureVisible(true)}
            />

            <CreateType show={typeVisible} onHide={() => setTypeVisible(false)}/>
            <CreateSubtype show={subtypeVisible} onHide={() => setSubtypeVisible(false)}/>
            <CreateFactory show={factoryVisible} onHide={() => setFactoryVisible(false)}/>
            <CreateCollection show={collectionVisible} onHide={() => setCollectionVisible(false)}/>
            <CreateProduct show={productVisible} onHide={() => setProductVisible(false)}/>
            <ImportProducts show={importVisible} onHide={() => setImportVisible(false)}/>
            <CreateFeature show={featureVisible} onHide={() => setFeatureVisible(false)}/>
            <EditProducts show={editProductsVisible} onHide={() => setEditProductsVisible(false)}/>
        </Container>
    );
};

export default Admin;