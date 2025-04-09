import { $host, $authHost } from '../../../shared/api';

// Получение всех продуктов с пагинацией и фильтрацией
export const fetchProducts = async (typeId, factoryId, page = 1, limit = 20) => {
    const { data } = await $host.get('api/product', {
        params: {
            typeId, factoryId, page, limit
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