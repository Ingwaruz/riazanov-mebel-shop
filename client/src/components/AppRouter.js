import React from 'react';
import {Routes, Route} from 'react-router-dom'
import {authRoutes, publicRoutes} from "../routes";
import Shop from "../pages/Shop";
const AppRouter = () => {
    const isAuth = true
    return (
        <div>
            <Routes>
                {isAuth && authRoutes.map(({path, Component}) =>
                    <Route key={path} path={path} element={<Component/>} exact/>
                )}
                {publicRoutes.map(({path, Component}) =>
                    <Route key={path} path={path} element={<Component/>} exact/>
                )}
                <Route path="*" element={<Shop />} />
            </Routes>
        </div>
    );
};

export default AppRouter;