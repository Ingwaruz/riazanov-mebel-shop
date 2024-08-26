import {$authHost, $host} from "./index";
import { jwtDecode } from "jwt-decode";

export const createType = async (type) => {
    const {data} = await $authHost.post('api/type', type);
    return data;
}

export const fetchTypes = async () => {
    const {data} = await $host.get('api/type');
    return data;
}

export const createFactory = async (factory) => {
    const {data} = await $authHost.post('api/factory', factory);
    return data;
}

export const fetchFactories = async () => {
    const {data} = await $host.get('api/factory');
    return data;
}


