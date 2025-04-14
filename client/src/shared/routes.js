import Admin from "../pages/Admin"
import {ADMIN_ROUTE, LOGIN_ROUTE, REGISTRATION_ROUTE, SHOP_ROUTE, PRODUCT_ROUTE} from "./utils/consts"
import Shop from "../pages/Shop"
import Auth from "../pages/Auth"
import { ProductPage } from "../pages/ProductPage"

export const authRoutes = [
    {
        path: ADMIN_ROUTE,
        Component: Admin,
        roles: ['ADMIN'] // Указываем, что этот маршрут доступен только админам
    }
]

export const publicRoutes = [
    {
        path: SHOP_ROUTE,
        Component: Shop,
    },
    {
        path: LOGIN_ROUTE,
        Component: Auth,
    },
    {
        path: REGISTRATION_ROUTE,
        Component: Auth,
    },
    {
        path: PRODUCT_ROUTE + '/:id',
        Component: ProductPage,
    },
] 