import React from 'react';
import '../../../app/styles/colors.scss';

const ButtonM2 = ({ width, height, text, onClick }) => {
    return (
        <button
            style={{
                width,
                height,
                border: '1px solid'
            }}

            className='
            d-flex
            align-items-center
            justify-content-center
            m-text
            bg-main_color_hover
            hover-item--main_color
            color_white
            border-radius-0
            p-3 mt-3
            '
            onClick={onClick}
        >
            {text}
        </button>
    );
};

export default ButtonM2;
