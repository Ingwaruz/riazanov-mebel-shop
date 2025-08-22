import { $authHost, $host } from '../../../shared/api';

/**
 * Отправка заказа
 * @param {Object} orderData - Данные заказа
 * @returns {Promise<Object>} - Ответ сервера
 */
export const createOrder = async (orderData) => {
    try {
        const { data } = await $host.post('api/order', orderData);
        return data;
    } catch (error) {
        console.error('Ошибка при создании заказа:', error);
        throw error;
    }
};

/**
 * Получение заказов пользователя
 * @param {Object} params - Параметры запроса (page, limit, status)
 * @returns {Promise<Object>} - Объект с массивом заказов и метаданными
 */
export const getUserOrders = async (params = {}) => {
    try {
        const { data } = await $authHost.get('api/order', { params });
        return data;
    } catch (error) {
        console.error('Ошибка при получении заказов пользователя:', error);
        throw error;
    }
};

/**
 * Получение всех заказов (для админа)
 * @param {Object} params - Параметры запроса (page, limit, status)
 * @returns {Promise<Object>} - Объект с массивом заказов и метаданными
 */
export const getAllOrders = async (params = {}) => {
    try {
        const { data } = await $authHost.get('api/order', { params });
        return data;
    } catch (error) {
        console.error('Ошибка при получении всех заказов:', error);
        throw error;
    }
};

/**
 * Получение деталей заказа
 * @param {number} orderId - ID заказа
 * @returns {Promise<Object>} - Данные заказа
 */
export const getOrderDetails = async (orderId) => {
    try {
        const { data } = await $authHost.get(`api/order/${orderId}`);
        return data;
    } catch (error) {
        console.error(`Ошибка при получении заказа #${orderId}:`, error);
        throw error;
    }
};

/**
 * Обновление статуса заказа (только для админа)
 * @param {number} orderId - ID заказа
 * @param {string} status - Новый статус
 * @returns {Promise<Object>} - Обновленные данные заказа
 */
export const updateOrderStatus = async (orderId, status) => {
    try {
        const { data } = await $authHost.put(`api/order/${orderId}/status`, { status });
        return data;
    } catch (error) {
        console.error(`Ошибка при обновлении статуса заказа #${orderId}:`, error);
        throw error;
    }
};

/**
 * Отмена заказа
 * @param {number} orderId - ID заказа
 * @param {string} reason - Причина отмены
 * @returns {Promise<Object>} - Ответ сервера
 */
export const cancelOrder = async (orderId, reason = '') => {
    try {
        const { data } = await $authHost.put(`api/order/${orderId}/cancel`, { reason });
        return data;
    } catch (error) {
        console.error(`Ошибка при отмене заказа #${orderId}:`, error);
        throw error;
    }
}; 