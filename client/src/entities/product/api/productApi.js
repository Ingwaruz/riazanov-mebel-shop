import { $host, $authHost } from '../../../shared/api';

// Получение всех продуктов с пагинацией и фильтрацией
export const fetchProducts = async (typeId, factoryId, page = 1, limit = 20, additionalParams = {}) => {
    const { data } = await $host.get('api/product', {
        params: {
            typeId, 
            factoryId, 
            page, 
            limit,
            ...additionalParams
        }
    });
    return data;
};

// Получение одного продукта по ID
export const fetchOneProduct = async (id) => {
    try {
        const { data } = await $host.get(`api/product/${id}`);
        return data;
    } catch (error) {
        console.error(`Ошибка при получении товара с ID ${id}:`, error);
        throw error;
    }
};

// Поиск продуктов
export const searchProducts = async (query, searchType = 'name') => {
    const { data } = await $host.get('api/product/search', { 
        params: { query, searchType } 
    });
    return data;
};

// Создание продукта (только для админа)
export const createProduct = async (product) => {
    const { data } = await $authHost.post('api/product', product);
    return data;
};

// Обновление продукта (только для админа)
export const updateProduct = async (id, formData) => {
    const { data } = await $authHost.put(`api/product/${id}`, formData);
    return data;
};

// Удаление продукта (только для админа)
export const deleteProduct = async (id) => {
    const { data } = await $authHost.delete(`api/product/${id}`);
    return data;
};

// Импорт продуктов (только для админа)
export const importProducts = async (formData) => {
    try {
        const { data } = await $authHost.post('api/product/import', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return data;
    } catch (error) {
        console.error('Error details:', error.response || error);
        throw error;
    }
};

// Получение типов продуктов
export const fetchTypes = async () => {
    const { data } = await $host.get('api/type');
    return data;
};

// Создание типа продукта (только для админа)
export const createType = async (type) => {
    const { data } = await $authHost.post('api/type', type);
    return data;
};

// Получение производителей
export const fetchFactories = async () => {
    const { data } = await $host.get('api/factory');
    return data;
};

// Создание производителя (только для админа)
export const createFactory = async (factory) => {
    const { data } = await $authHost.post('api/factory', factory);
    return data;
};

// Получение коллекций
export const fetchCollections = async () => {
    const { data } = await $host.get('api/collection');
    return data;
};

// Создание коллекции (только для админа)
export const createCollection = async (collection) => {
    const { data } = await $authHost.post('api/collection', collection);
    return data;
};

// Получение характеристик по типу и производителю
export const fetchFeaturesByTypeAndFactory = async (typeId, factoryId) => {
    const { data } = await $host.get('api/feature', {
        params: { typeId, factoryId }
    });
    return data;
};

// Создание характеристики (только для админа)
export const createFeature = async (feature) => {
    const { data } = await $authHost.post('api/feature', feature);
    return data;
};

// Получение подтипов
export const fetchSubtypes = async (typeId) => {
    const { data } = await $host.get('api/subtype', {
        params: { typeId }
    });
    return data;
};

// Создание подтипа (только для админа)
export const createSubtype = async (subtype) => {
    const { data } = await $authHost.post('api/subtype', subtype);
    return data;
}; 