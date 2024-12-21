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

export const fetchProducts = async (typeId, factoryId, page, limit = 5) => {
    const {data} = await $host.get('api/product', {params: {
        typeId, factoryId, page, limit
    }});
    return data;
}

export const fetchOneProduct = async (id) => {
    const {data} = await $host.get('api/product/' + id);
    return data;
}

export const fetchFilteredProducts = async (filters) => {
    const {data} = await $host.get('api/product/filter', {
        params: filters
    });
    return data;
};

export const importProducts = async (formData) => {
    const {data} = await $authHost.post('api/product/import', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return data;
};

// Характеристики
export const createFeature = async (feature) => {
    const {data} = await $authHost.post('api/feature', feature);
    return data;
}

export const fetchFeatures = async () => {
    const {data} = await $host.get('api/feature');
    return data;
}

export const fetchFeaturesByTypeAndFactory = async (typeId, factoryId) => {
    const {data} = await $host.get('api/feature/byTypeAndFactory', {
        params: { typeId, factoryId }
    });
    return data;
}


