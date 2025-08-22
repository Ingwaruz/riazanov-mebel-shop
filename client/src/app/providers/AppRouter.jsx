import React, {useContext, Suspense, startTransition} from 'react';
import {Routes, Route, Navigate} from 'react-router-dom';
import {authRoutes, publicRoutes} from "../routes";
import {ShopPage as Shop} from "../../pages/Shop";
import {Context} from "../../index";
import RequireAuth from "../../shared/components/RequireAuth";
import {observer} from 'mobx-react-lite';
import { Spinner } from 'react-bootstrap';

const AppRouter = observer(() => {
    const {user} = useContext(Context);

    return (
        <div>
            <Suspense fallback={
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
                    <div className="text-center">
                        <Spinner animation="border" variant="primary" />
                        <div className="mt-2">Загрузка...</div>
                    </div>
                </div>
            }>
                <Routes>
                    {authRoutes.map(({path, Component}) => {
                        // Администраторские маршруты
                        if (path.startsWith('/admin')) {
                            return (
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
                            );
                        }
                        
                        // Маршруты для авторизованных пользователей
                        return (
                            <Route 
                                key={path} 
                                path={path} 
                                element={
                                    <RequireAuth>
                                        <Component/>
                                    </RequireAuth>
                                } 
                                exact
                            />
                        );
                    })}
                    {publicRoutes.map(({path, Component}) =>
                        <Route key={path} path={path} element={<Component/>} exact/>
                    )}
                    <Route path="*" element={<Shop />} />
                </Routes>
            </Suspense>
        </div>
    );
});

export default AppRouter; 