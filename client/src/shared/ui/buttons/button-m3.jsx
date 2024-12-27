import React from 'react';

const ButtonM3 = ({ width, height, text, onClick }) => {
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
            l-text bg-main_color_hover hover-item--main_color
            p-3 mt-0 color_white text-center
            '
            onClick={onClick}
        >
            {text}
        </button>
    );
};

export default ButtonM3;
