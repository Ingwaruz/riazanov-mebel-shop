import React, {useContext} from 'react';
import {Routes, Route, Navigate} from 'react-router-dom';
import {authRoutes, publicRoutes} from "../routes";
import {ShopPage as Shop} from "../../pages/Shop";
import {Context} from "../../index";
import RequireAuth from "../../shared/components/RequireAuth";
import {observer} from 'mobx-react-lite';

const AppRouter = () => {
    const {user} = useContext(Context);

    return (
        <div>
            <Routes>
                {user.isAuth && authRoutes.map(({path, Component}) =>
                    <Route 
                        key={path} 
                        path={path} 
                        element={
                            <RequireAuth roles={['ADMIN']}>
                                <Component/>
                            </RequireAuth>
                        } 
                        exact
                    />
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