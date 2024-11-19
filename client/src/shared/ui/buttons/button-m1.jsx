import React from 'react';
import '../../../app/styles/colors.scss';

const ButtonM1 = ({ width, height, text, onClick }) => {
    return (
        <button
            style={{
                width,
                height,
                border: '1px solid'
            }}

            className='
            d-flex align-items-center justify-content-center
            m-text bg-main_color main_color_hover hover-item--main_color_active
            border-radius-0 p-2 mt-3
            '
            onClick={onClick}
        >
            {text}
        </button>
    );
};

export default ButtonM1;
