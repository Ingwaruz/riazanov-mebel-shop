import React from 'react';

const ButtonM4 = ({ width, height, text, onClick, variant = 'outline', disabled }) => {
    const getButtonClasses = () => {
        const baseClasses = 'd-flex align-items-center justify-content-center l-text p-2 mt-3 text-center';
        
        if (disabled) {
            return `${baseClasses} bg-light text-secondary border-secondary`;
        }
        
        if (variant === 'primary') {
            return `${baseClasses} bg-main_color text-white hover-item--main_color_hover`;
        }
        
        return `${baseClasses} bg-white main_color hover-item--main_color`;
    };

    return (
        <button
            style={{
                width,
                height,
                border: '1px solid',
                borderRadius: '0.5rem'
            }}
            className={getButtonClasses()}
            onClick={onClick}
            disabled={disabled}
        >
            {text}
        </button>
    );
};

export default ButtonM4;