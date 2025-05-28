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
    // Преобразуем selectedSubtypes в правильный формат для передачи на сервер
    const params = { ...filters };
    if (params.selectedSubtypes && Array.isArray(params.selectedSubtypes)) {
        params.selectedSubtypes = params.selectedSubtypes.join(',');
    }
    
    const {data} = await $host.get('api/product/filter', { params });
    return data;
};

export const fetchSizeRanges = async () => {
    const {data} = await $host.get('api/product/sizes');
    return data;
};

export const fetchPriceRange = async () => {
    const {data} = await $host.get('api/product/prices');
    return data;
};

export const fetchSubtypesByType = async (typeId) => {
    const {data} = await $host.get(`api/subtype/${typeId}`);
    return data;
}; 