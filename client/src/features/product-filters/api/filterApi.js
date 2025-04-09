import { $host } from '../../../shared/api';

export const fetchTypes = async () => {
    const {data} = await $host.get('api/type');
    return data;
};

export const fetchFactories = async () => {
    const {data} = await $host.get('api/factory');
    return data;
};

export const fetchFilteredProducts = async (filters) => {
    const {data} = await $host.get('api/product/filter', { params: filters });
    return data;
};

export const fetchSizeRanges = async () => {
    const {data} = await $host.get('api/product/size-ranges');
    return data;
};

export const fetchPriceRange = async () => {
    const {data} = await $host.get('api/product/price-range');
    return data;
}; 