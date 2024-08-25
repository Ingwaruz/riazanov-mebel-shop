import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import {Card, Col, Row} from "react-bootstrap";

const FactoryBar = observer(() => {
    const { product } = useContext(Context);
    return (
        <Col className="d-flex">
            {product.factories.map(factory =>
                <Card
                    style={{cursor:"pointer"}}
                    key={factory.id}
                    className="p-3"
                    onClick={() => product.setSelectedFactory(factory)}
                    border={factory.id === product.selectedFactory.id ? 'dark' : 'light'}
                    //bg={factory.id === product.selectedFactory.id ? 'success' : 'light'}
                >
                    {factory.name}
                </Card>
            )}
        </Col>
    );
});

export default FactoryBar;