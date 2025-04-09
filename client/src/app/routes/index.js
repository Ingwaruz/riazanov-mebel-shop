import React, { lazy, Suspense } from 'react';
import { Spinner } from 'react-bootstrap';
import { ADMIN_ROUTE, BASKET_ROUTE, LOGIN_ROUTE, PRODUCT_ROUTE, REGISTRATION_ROUTE, SHOP_ROUTE } from "../../shared/config/route-constants";

// Ленивая загрузка страниц
const ProductPage = lazy(() => import("../../pages/ProductPage"));
const Admin = lazy(() => import("../../pages/Admin"));
const Basket = lazy(() => import("../../pages/Basket"));
const Shop = lazy(() => import("../../pages/Shop"));
const Auth = lazy(() => import("../../pages/Auth"));

// Компонент-обертка для ленивой загрузки
const LazyLoadWrapper = ({ children }) => (
    <Suspense fallback={<div className="d-flex justify-content-center mt-5"><Spinner animation="border" /></div>}>
        {children}
    </Suspense>
);

export const authRoutes = [
    {
        path: ADMIN_ROUTE,
        Component: () => (
            <LazyLoadWrapper>
                <Admin />
            </LazyLoadWrapper>
        )
    },
    {
        path: BASKET_ROUTE,
        Component: () => (
            <LazyLoadWrapper>
                <Basket />
            </LazyLoadWrapper>
        )
    }
];

export const publicRoutes = [
    {
        path: SHOP_ROUTE,
        Component: () => (
            <LazyLoadWrapper>
                <Shop />
            </LazyLoadWrapper>
        )
    },
    {
        path: LOGIN_ROUTE,
        Component: () => (
            <LazyLoadWrapper>
                <Auth />
            </LazyLoadWrapper>
        )
    },
    {
        path: REGISTRATION_ROUTE,
        Component: () => (
            <LazyLoadWrapper>
                <Auth />
            </LazyLoadWrapper>
        )
    },
    {
        path: PRODUCT_ROUTE + '/:id',
        Component: () => (
            <LazyLoadWrapper>
                <ProductPage />
            </LazyLoadWrapper>
        )
    }
]; 