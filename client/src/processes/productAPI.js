import {$authHost, $host} from "./index";

// Типы
export const createType = async (type) => {
    const {data} = await $authHost.post('api/type', type);
    return data;
}

export const fetchTypes = async () => {
    const {data} = await $host.get('api/type');
    return data;
}

// Подтип
export const createSubtype = async (subtype) => {
    const {data} = await $authHost.post('api/subtype', subtype);
    return data;
}

export const fetchSubtypes = async () => {
    const {data} = await $host.get('api/subtype');
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

// Коллекции
export const createCollection = async (collection) => {
    const {data} = await $authHost.post('api/collection', collection);
    return data;
};

export const fetchCollections = async () => {
    const {data} = await $host.get('api/collection');
    return data;
}

// Товар
export const createProduct = async (product) => {
    const {data} = await $authHost.post('api/product', product);
    return data;
}

export const fetchProducts = async (typeId, factoryId, page = 1, limit = 20) => {
    const {data} = await $host.get('api/product', {params: {
        typeId, factoryId, page, limit
    }});
    return data;
}

export const fetchOneProduct = async (id) => {
    try {
        console.log(`Отправка запроса на получение товара с ID: ${id}`);
        const {data} = await $host.get(`api/product/${id}`);
        console.log('Данные товара получены успешно:', data);
        return data;
    } catch (error) {
        console.error(`Ошибка при получении товара с ID ${id}:`, error);
        console.error('Детали запроса:', {
            url: `api/product/${id}`,
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data
        });
        throw error;
    }
};

export const fetchFilteredProducts = async (filters) => {
    const {data} = await $host.get('api/product/filter', {
        params: filters
    });
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

export const importProducts = async (formData) => {
    try {
        console.log('Sending request to:', process.env.REACT_APP_API_URL + 'api/product/import');
        console.log('FormData contents:', Array.from(formData.entries()));
        
        const {data} = await $authHost.post('api/product/import', formData, {
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

// Характеристики
export const createFeature = async (feature) => {
    try {
        const {data} = await $authHost.post('api/feature', {
            name: feature.name,
            typeId: feature.typeId,
            factoryId: feature.factoryId
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log('API response:', data);
        return data;
    } catch (error) {
        console.error('Error creating feature:', error.response?.data || error);
        throw error;
    }
}

export const fetchFeatures = async () => {
    const {data} = await $host.get('api/feature');
    return data;
}

export const fetchFeaturesByTypeAndFactory = async (typeId, factoryId) => {
    try {
        const {data} = await $host.get('api/feature/byTypeAndFactory', {
            params: {
                typeId: Number(typeId),
                factoryId: Number(factoryId)
            }
        });
        return data;
    } catch (error) {
        console.error('Error fetching features:', error);
        return [];
    }
};

export const searchFeatures = async (query) => {
    try {
        const {data} = await $host.get('api/feature/search', {
            params: { query }
        });
        return data;
    } catch (error) {
        console.error('Error searching features:', error);
        return [];
    }
};

export const searchProducts = async (query, searchType = 'name') => {
    const { data } = await $host.get('api/product/search', { 
        params: { query, searchType } 
    });
    return data;
};

export const updateProduct = async (id, formData) => {
    const { data } = await $authHost.put(`api/product/${id}`, formData);
    return data;
};


