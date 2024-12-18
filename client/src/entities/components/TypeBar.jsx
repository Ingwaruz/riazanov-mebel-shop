import React, { useContext } from 'react';
import { ListGroup } from 'react-bootstrap';
import { observer } from 'mobx-react-lite';
import { Context } from "../../index";
import '../../app/styles/shared.scss';
import '../../app/styles/commonStyles.scss';

const TypeBar = observer(() => {
    const { product } = useContext(Context);

    const resetSelectedType = () => {
        product.setSelectedType(null); // Сбрасываем выбранный тип
    };

    // Создаем отсортированную копию массива типов по возрастанию id
    const sortedTypes = [...product.types].sort((a, b) => a.id - b.id);

    return (
        <ListGroup
            className={'border-radius-0 ms-0 mt-0'}
        >
            <ListGroup.Item
                className={`ps-3 m-text ${!product.selectedType ?
                    'border-focus_input_color'
                    :
                    'bg-color_white hover-item--main_color_active'
                }`}
                onClick={() => { product.resetFilters() }}
                active={!product.selectedType} // Активно, если тип не выбран
            >
                ВСЯ МЕБЕЛЬ
            </ListGroup.Item>
            {sortedTypes.map(type =>
                <ListGroup.Item
                    className={`ps-3 m-text ${type.id === product.selectedType?.id ?
                        'bg-main_color_active border-main_color'
                        :
                        'bg-color_white hover-item--main_color_active'
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
