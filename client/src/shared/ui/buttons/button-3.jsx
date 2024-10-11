import React from 'react';
import '../../../app/styles/shared.scss';

const Button1 = ({ width, height, text }) => {
    return (
        <div style={{ width, height }} className='m-text hover-item--black p-2 mt-3'>
            {text}
        </div>
    );
};

export default Button1;
