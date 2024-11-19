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
                    'main_font_color bg-color_white border-focus_input_color' 
                    : 
                    'main_font_color bg-color_white'
                }`}
                onClick={() => { product.resetFilters() }}
                active={!product.selectedType} // Активно, если тип не выбран
            >
                ВСЯ МЕБЕЛЬ
            </ListGroup.Item>
            {product.types.map(type =>
                <ListGroup.Item
                    className={`hover-item--lightgray s-text main_color ps-3 ${type.id === product.selectedType?.id ? 
                        'main_font_color bg-focus_input_color border-main_color' 
                        : 
                        'main_font_color bg-color_white' +
                        ''}`}
                    active={type.id === product.selectedType?.id}
                    onClick={() => product.setSelectedType(type)}
                    bg={'color_white'}
                    key={type.id}
                >
                    {type.name.toUpperCase()}
                </ListGroup.Item>
            )}
        </ListGroup>
    );
});

export default TypeBar;
