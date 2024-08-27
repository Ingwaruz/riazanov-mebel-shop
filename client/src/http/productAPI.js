import {$authHost, $host} from "./index";
import { jwtDecode } from "jwt-decode";

// Типы
export const createType = async (type) => {
    const {data} = await $authHost.post('api/type', type);
    return data;
}

export const fetchTypes = async () => {
    const {data} = await $host.get('api/type');
    return data;
}

// Производители
export const createFactory = async (factory) => {
    const {data} = await $authHost.post('api/factory', factory);
    return data;
}

export const fetchFactories = async () => {
    const {data} = await $host.get('api/factory');
    return data;
}

// Товар
export const createProduct = async (product) => {
    const {data} = await $authHost.post('api/product', product);
    return data;
}

export const fetchProducts = async (typeId, factoryId, page, limit = 5) => {
    const {data} = await $host.get('api/product', {params: {
        typeId, factoryId, page, limit
    }});
    return data;
}

export const fetchOneProducts = async (id) => {
    const {data} = await $host.get('api/product/' + id);
    return data;
}


