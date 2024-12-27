import React from 'react';
import '../../../app/styles/colors.scss';

const ButtonM2 = ({ width, height, text, onClick }) => {
    return (
        <button
            style={{
                width,
                height,
                border: '1px solid',
                borderRadius: '0.5rem'
            }}

            className='
            d-flex align-items-center justify-content-center
            m-text bg-main_color_hover hover-item--main_color
            p-2 mt-2 color_white text-center
            '
            onClick={onClick}
        >
            {text}
        </button>
    );
};

export default ButtonM2;
