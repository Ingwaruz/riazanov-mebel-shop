import React, { useContext } from 'react';
import { ListGroup } from 'react-bootstrap';
import { observer } from 'mobx-react-lite';
import { Context } from "../index";

const TypeBar = observer(() => {
    const { product } = useContext(Context);

    const resetSelectedType = () => {
        product.setSelectedType(null); // Сбрасываем выбранный тип
    };

    return (
        <ListGroup
            className={'border-radius-0'}
        >
            <ListGroup.Item
                className={`type-item hover-item ps-3 m-text ${!product.selectedType ? 
                    'color-black bg-color-white border-color-lightgray' 
                    : 
                    'color-black bg-color-white'
                }`}
                onClick={() => { product.resetFilters() }}
                active={!product.selectedType} // Активно, если тип не выбран
            >
                Все
            </ListGroup.Item>
            {product.types.map(type =>
                <ListGroup.Item
                    className={`type-item hover-item s-text color-gray ps-3 ${type.id === product.selectedType?.id ? 
                        'color-black bg-color-lightgray border-color-gray' 
                        : 
                        'color-black bg-color-white' +
                        ''}`}
                    active={type.id === product.selectedType?.id}
                    onClick={() => product.setSelectedType(type)}
                    bg={'color-white'}
                    key={type.id}
                >
                    {type.name}
                </ListGroup.Item>
            )}
        </ListGroup>
    );
});

export default TypeBar;
