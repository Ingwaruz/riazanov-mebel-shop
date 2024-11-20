import React from 'react';

const ButtonM3 = ({ width, height, text, onClick }) => {
    return (
        <button
            style={{
                width,
                height,
                border: '1px solid'
            }}

            className='
            d-flex align-items-center justify-content-center
            m-text bg-main_color_hover hover-item--main_color
            border-radius-0 p-4 mt-3 color_white
            '
            onClick={onClick}
        >
            {text}
        </button>
    );
};

export default ButtonM3;
