import React, {useContext} from 'react';
import {Routes, Route} from 'react-router-dom'
import {authRoutes, publicRoutes} from "../../app/routes";
import {Context} from "../../index";
import { RequireAuth } from "../../entities/user";
import { lazy, Suspense } from 'react';
import { Spinner } from 'react-bootstrap';

// Ленивая загрузка компонента Shop для маршрута по умолчанию
const Shop = lazy(() => import("../../pages/Shop"));

const AppRouter = () => {
    const {user} = useContext(Context)

    return (
        <div>
            <Routes>
                {user.isAuth && authRoutes.map(({path, Component}) =>
                    <Route 
                        key={path} 
                        path={path} 
                        element={
                            <RequireAuth roles={['ADMIN']}>
                                <Component />
                            </RequireAuth>
                        } 
                        exact
                    />
                )}
                {publicRoutes.map(({path, Component}) =>
                    <Route key={path} path={path} element={<Component />} exact/>
                )}
                <Route path="*" element={
                    <Suspense fallback={<div className="d-flex justify-content-center mt-5"><Spinner animation="border" /></div>}>
                        <Shop />
                    </Suspense>
                } />
            </Routes>
        </div>
    );
};

export default AppRouter;