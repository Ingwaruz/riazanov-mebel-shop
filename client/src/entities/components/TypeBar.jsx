import React, { useContext } from 'react';
import {Col, ListGroup} from 'react-bootstrap';
import { observer } from 'mobx-react-lite';
import { Context } from "../../index";
import '../../app/styles/shared.scss';
import '../../app/styles/commonStyles.scss';

const TypeBar = observer(() => {
    const { product } = useContext(Context);

    const resetSelectedType = () => {
        product.setSelectedType(null); // Сбрасываем выбранный тип
    };

    return (
        <ListGroup
            className={'border-radius-0 ms-0 mt-0'}
        >
            <ListGroup.Item
                className={`hover-item--lightgray ps-3 s-text ${!product.selectedType ? 
                    'border-focus_input_color' 
                    : 
                    'bg-color_white'
                }`}
                onClick={() => { product.resetFilters() }}
                active={!product.selectedType} // Активно, если тип не выбран
            >
                ВСЯ МЕБЕЛЬ
            </ListGroup.Item>
            {product.types.map(type =>
                <ListGroup.Item
                    className={`ps-3 s-text ${type.id === product.selectedType?.id ? 
                        'bg-focus_input_color border-main_color' 
                        : 
                        'bg-color_white'
                        }`}
                    active={type.id === product.selectedType?.id}
                    onClick={() => product.setSelectedType(type)}
                    key={type.id}
                >
                    {type.name.toUpperCase()}
                </ListGroup.Item>
            )}
        </ListGroup>
    );
});

export default TypeBar;
