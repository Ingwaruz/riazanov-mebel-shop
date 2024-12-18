import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../../index";
import {Card, Col, Row} from "react-bootstrap";
import '../../app/styles/shared.scss';
import '../../app/styles/commonStyles.scss';

const FactoryBar = observer(() => {
    const { product } = useContext(Context);

    // Сортировка фабрик по id
    const sortedFactories = product.factories.slice().sort((a, b) => a.id - b.id);

    return (
        <Col className="d-flex flex-md-row flex-column">
            {sortedFactories.map(factory => (
                <Card
                    key={factory.id}
                    className={`p-2 m-text border-radius-0 w-100 text-center ${
                        factory.id === product.selectedFactory?.id
                            ? 'bg-main_color_active border-main_color text-white'
                            : 'bg-color_white hover-item--main_color_active text-dark'
                    }`}
                    onClick={() => product.setSelectedFactory(factory)}
                >
                    {factory.name}
                </Card>
            ))}
        </Col>
    );
});

export default FactoryBar;
