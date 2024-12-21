import React, {useContext} from 'react';
import {Navigate, useLocation} from 'react-router-dom';
import {Context} from "../../index";
import {LOGIN_ROUTE} from "../utils/consts";

const RequireAuth = ({children, roles}) => {
    const {user} = useContext(Context);
    const location = useLocation();

    if (!user.isAuth) {
        // Не авторизован - перенаправляем на страницу входа
        return <Navigate to={LOGIN_ROUTE} state={{from: location}} replace />;
    }

    if (roles && !roles.includes(user.user.role)) {
        // Роль пользователя не входит в список разрешенных - перенаправляем на главную
        return <Navigate to="/" replace />;
    }

    return children;
};

export default RequireAuth; 