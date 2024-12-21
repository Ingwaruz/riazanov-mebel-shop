import React from 'react';
import {Routes, Route} from 'react-router-dom'
import {authRoutes, publicRoutes} from "../shared/routes";
import Shop from "../pages/Shop";
import RequireAuth from "../shared/components/RequireAuth";

const AppRouter = () => {
    return (
        <Routes>
            {publicRoutes.map(({path, Component}) =>
                <Route key={path} path={path} element={<Component/>}/>
            )}
            {authRoutes.map(({path, Component, roles}) =>
                <Route
                    key={path}
                    path={path}
                    element={
                        <RequireAuth roles={roles}>
                            <Component/>
                        </RequireAuth>
                    }
                />
            )}
            <Route path="*" element={<Shop/>}/>
        </Routes>
    );
};

export default AppRouter; 