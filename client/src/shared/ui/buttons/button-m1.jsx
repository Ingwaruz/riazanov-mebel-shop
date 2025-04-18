import React from 'react';
import '../../../app/styles/colors.scss';

const ButtonM1 = ({ width, height, text, onClick, className = '' }) => {
    return (
        <button
            style={{
                width,
                height,
                border: '1px solid',
                borderRadius: '0.5rem'
            }}

            className={`
            d-flex align-items-center justify-content-center
            l-text bg-main_color_hover hover-item--main_color
            p-3 mt-3 color_white text-center
            ${className}
            `}
            onClick={onClick}
        >
            {text}
        </button>
    );
};

export default ButtonM1;
