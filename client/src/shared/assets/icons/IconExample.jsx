import React from 'react';
import { ReactComponent as Cart } from './cart.svg';
import { ReactComponent as User } from './user.svg';
import { ReactComponent as Search } from './search.svg';
import { ReactComponent as Heart } from './heart.svg';
import { ReactComponent as Menu } from './menu.svg';
import { ReactComponent as Close } from './close.svg';
import { ReactComponent as LeftArrow } from './left-arrow.svg';
import { ReactComponent as RightArrow } from './right-arrow.svg';

// Пример компонента для демонстрации иконок
const IconExample = () => {
    const iconStyle = {
        width: '24px',
        height: '24px',
        margin: '8px',
        color: '#333',
        cursor: 'pointer',
        transition: 'color 0.2s ease'
    };

    const handleIconHover = (e) => {
        e.target.style.color = '#007bff';
    };

    const handleIconLeave = (e) => {
        e.target.style.color = '#333';
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h3>Примеры SVG иконок</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ margin: '10px', textAlign: 'center' }}>
                    <Cart 
                        style={iconStyle} 
                        onMouseEnter={handleIconHover}
                        onMouseLeave={handleIconLeave}
                    />
                    <div>Корзина</div>
                </div>
                
                <div style={{ margin: '10px', textAlign: 'center' }}>
                    <User 
                        style={iconStyle} 
                        onMouseEnter={handleIconHover}
                        onMouseLeave={handleIconLeave}
                    />
                    <div>Пользователь</div>
                </div>
                
                <div style={{ margin: '10px', textAlign: 'center' }}>
                    <Search 
                        style={iconStyle} 
                        onMouseEnter={handleIconHover}
                        onMouseLeave={handleIconLeave}
                    />
                    <div>Поиск</div>
                </div>
                
                <div style={{ margin: '10px', textAlign: 'center' }}>
                    <Heart 
                        style={iconStyle} 
                        onMouseEnter={handleIconHover}
                        onMouseLeave={handleIconLeave}
                    />
                    <div>Избранное</div>
                </div>
                
                <div style={{ margin: '10px', textAlign: 'center' }}>
                    <Menu 
                        style={iconStyle} 
                        onMouseEnter={handleIconHover}
                        onMouseLeave={handleIconLeave}
                    />
                    <div>Меню</div>
                </div>
                
                <div style={{ margin: '10px', textAlign: 'center' }}>
                    <Close 
                        style={iconStyle} 
                        onMouseEnter={handleIconHover}
                        onMouseLeave={handleIconLeave}
                    />
                    <div>Закрыть</div>
                </div>
                
                <div style={{ margin: '10px', textAlign: 'center' }}>
                    <LeftArrow 
                        style={iconStyle} 
                        onMouseEnter={handleIconHover}
                        onMouseLeave={handleIconLeave}
                    />
                    <div>Назад</div>
                </div>
                
                <div style={{ margin: '10px', textAlign: 'center' }}>
                    <RightArrow 
                        style={iconStyle} 
                        onMouseEnter={handleIconHover}
                        onMouseLeave={handleIconLeave}
                    />
                    <div>Вперед</div>
                </div>
            </div>
        </div>
    );
};

export default IconExample; 