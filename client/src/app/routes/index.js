import React, { lazy, Suspense } from 'react';
import { Spinner } from 'react-bootstrap';
import { ADMIN_ROUTE, BASKET_ROUTE, LOGIN_ROUTE, PRODUCT_ROUTE, REGISTRATION_ROUTE, SHOP_ROUTE } from "../../shared/config/route-constants";

// Импорт компонентов из новой структуры
import { ProductPage } from "../../pages/ProductPage";
import Admin from "../../pages/Admin";
import { BasketPage as Basket } from "../../pages/Basket";
import { ShopPage as Shop } from "../../pages/Shop";
import { AuthPage as Auth } from "../../pages/Auth";

// Компонент-обертка для ленивой загрузки (не используется в текущей версии)
const LazyLoadWrapper = ({ children }) => (
    <Suspense fallback={<div className="d-flex justify-content-center mt-5"><Spinner animation="border" /></div>}>
        {children}
    </Suspense>
);

export const authRoutes = [
    {
        path: ADMIN_ROUTE,
        Component: Admin
    },
    {
        path: BASKET_ROUTE,
        Component: Basket
    }
];

export const publicRoutes = [
    {
        path: SHOP_ROUTE,
        Component: Shop
    },
    {
        path: LOGIN_ROUTE,
        Component: Auth
    },
    {
        path: REGISTRATION_ROUTE,
        Component: Auth
    },
    {
        path: PRODUCT_ROUTE + '/:id',
        Component: ProductPage
    }
]; 