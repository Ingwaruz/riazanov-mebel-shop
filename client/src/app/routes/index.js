import React, { lazy } from 'react';
import { 
    ADMIN_ROUTE, 
    BASKET_ROUTE, 
    CHECKOUT_ROUTE, 
    LOGIN_ROUTE, 
    ORDER_CONFIRMATION_ROUTE, 
    ORDER_ROUTE, 
    ORDERS_ROUTE, 
    PRODUCT_ROUTE, 
    REGISTRATION_ROUTE, 
    SHOP_ROUTE 
} from "../../shared/config/route-constants";

// Ленивая загрузка компонентов для оптимизации
const ProductPage = lazy(() => import("../../pages/ProductPage").then(module => ({ default: module.ProductPage })));
const Admin = lazy(() => import("../../pages/Admin"));
const BasketPage = lazy(() => import("../../pages/Basket").then(module => ({ default: module.BasketPage })));
const ShopPage = lazy(() => import("../../pages/Shop").then(module => ({ default: module.ShopPage })));
const AuthPage = lazy(() => import("../../pages/Auth").then(module => ({ default: module.AuthPage })));
const CheckoutPage = lazy(() => import("../../pages/Checkout").then(module => ({ default: module.CheckoutPage })));
const OrdersPage = lazy(() => import("../../pages/Orders").then(module => ({ default: module.OrdersPage })));
const OrderDetailPage = lazy(() => import("../../pages/OrderDetail").then(module => ({ default: module.OrderDetailPage })));
const OrderConfirmationPage = lazy(() => import("../../pages/OrderConfirmation").then(module => ({ default: module.OrderConfirmationPage })));

// Компонент-обертка для ленивой загрузки (теперь Suspense в AppRouter)
const LazyLoadWrapper = ({ children }) => children;

export const authRoutes = [
    {
        path: ADMIN_ROUTE,
        Component: Admin
    },
    {
        path: ORDERS_ROUTE,
        Component: OrdersPage
    },
    {
        path: ORDER_ROUTE + '/:orderId',
        Component: OrderDetailPage
    }
];

export const publicRoutes = [
    {
        path: SHOP_ROUTE,
        Component: ShopPage
    },
    {
        path: LOGIN_ROUTE,
        Component: AuthPage
    },
    {
        path: REGISTRATION_ROUTE,
        Component: AuthPage
    },
    {
        path: PRODUCT_ROUTE + '/:id',
        Component: ProductPage
    },
    {
        path: BASKET_ROUTE,
        Component: BasketPage
    },
    {
        path: CHECKOUT_ROUTE,
        Component: CheckoutPage
    },
    {
        path: ORDER_CONFIRMATION_ROUTE + '/:orderId',
        Component: OrderConfirmationPage
    }
]; 