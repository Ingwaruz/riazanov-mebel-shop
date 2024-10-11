import React from 'react';

const ButtonM2 = ({ width, height, text, onClick }) => {
    return (
        <button
            style={{
                width,
                height,
                border: '1px solid'
            }}

            className='
            d-flex align-items-center justify-content-center
            m-text bg-color-white border-color-gray hover-item--gray
            border-radius-0 p-2 mt-3
            '
            onClick={onClick}
        >
            {text}
        </button>
    );
};

export default ButtonM2;
