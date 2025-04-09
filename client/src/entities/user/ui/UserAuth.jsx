import React, { useContext } from 'react';
import { Button } from 'react-bootstrap';
import { Context } from '../../../index';
import { useNavigate } from 'react-router-dom';
import { SHOP_ROUTE, LOGIN_ROUTE } from '../../../shared/config/route-constants';
import './UserAuth.scss';

const UserAuth = () => {
    const { user } = useContext(Context);
    const navigate = useNavigate();

    const logOut = () => {
        user.setUser({});
        user.setIsAuth(false);
        localStorage.removeItem('token');
        navigate(SHOP_ROUTE);
    };

    const logIn = () => {
        navigate(LOGIN_ROUTE);
    };

    return (
        <div className="user-auth">
            {user.isAuth ? (
                <Button 
                    variant="outline-danger" 
                    className="user-auth__logout-btn"
                    onClick={logOut}
                >
                    Выйти
                </Button>
            ) : (
                <Button 
                    variant="outline-light" 
                    className="user-auth__login-btn"
                    onClick={logIn}
                >
                    Авторизация
                </Button>
            )}
        </div>
    );
};

export default UserAuth; 