import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../../index";
import {Card, Col, Row} from "react-bootstrap";

const FactoryBar = observer(() => {
    const { product } = useContext(Context);

    // Сортировка фабрик по id
    const sortedFactories = product.factories.slice().sort((a, b) => a.id - b.id);

    return (
        <Col
            className="d-flex flex-md-row flex-column"
        >
            {sortedFactories.map(factory =>
                <Card
                    style={{cursor:"pointer"}}
                    key={factory.id}
                    className="p-2 s-text border-radius-0 hover-item--lightgray w-100 text-center"
                    onClick={() => product.setSelectedFactory(factory)}
                    border={factory.id === product.selectedFactory.id ?
                        'color-black bg-color-lightgray border-color-gray'
                        :
                        'color-black bg-color-white border-color-lightgray'}
                >
                    {factory.name}
                </Card>
            )}
        </Col>
    );
});

export default FactoryBar;
