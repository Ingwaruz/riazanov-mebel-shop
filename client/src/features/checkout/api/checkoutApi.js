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
 * @returns {Promise<Array>} - Массив заказов пользователя
 */
export const getUserOrders = async () => {
    try {
        const { data } = await $authHost.get('api/order/user');
        return data;
    } catch (error) {
        console.error('Ошибка при получении заказов пользователя:', error);
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