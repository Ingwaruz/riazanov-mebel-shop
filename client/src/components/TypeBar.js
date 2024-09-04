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
        <ListGroup>
            <ListGroup.Item
                className={`type-item ${!product.selectedType ? 'color-white' : 'color-black'}`}
                onClick={resetSelectedType}
                active={!product.selectedType} // Активно, если тип не выбран
            >
                Все
            </ListGroup.Item>
            {product.types.map(type =>
                <ListGroup.Item
                    className={`type-item ${type.id === product.selectedType?.id ? 'color-white' : 'color-black'}`}
                    active={type.id === product.selectedType?.id}
                    onClick={() => product.setSelectedType(type)}
                    key={type.id}
                >
                    {type.name}
                </ListGroup.Item>
            )}
        </ListGroup>
    );
});

export default TypeBar;
