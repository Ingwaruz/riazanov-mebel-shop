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
        <Col
            className="d-flex flex-md-row flex-column"
        >
            {sortedFactories.map(factory =>
                <Card
                    key={factory.id}
                    className="p-2 s-text border-radius-0 hover-item--lightgray w-100 text-center"
                    onClick={() => product.setSelectedFactory(factory)}
                    border={factory.id === product.selectedFactory.id ?
                        'bg-focus_input_color border-main_color'
                        :
                        'bg-color_white border-focus_input_color'}
                >
                    {factory.name}
                </Card>
            )}
        </Col>
    );
});

export default FactoryBar;
