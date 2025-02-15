import {$authHost, $host} from "./index";
import { jwtDecode } from "jwt-decode";

// Регистрация пользователя
export const registration = async (email, password) => {
    try {
        const response = await $host.post('api/user/registration', {
            email, 
            password, 
            role: 'USER'
        });
        
        if (response.data && response.data.token) {
            localStorage.setItem('token', response.data.token);
            return jwtDecode(response.data.token);
        }
        throw new Error('Некорректный ответ от сервера: отсутствует токен');
    } catch (error) {
        console.error('Registration error:', error);
        if (error.response?.data?.message) {
            throw error;
        }
        throw new Error('Ошибка при регистрации: ' + (error.message || 'неизвестная ошибка'));
    }
};

// Логин пользователя
export const login = async (email, password) => {
    try {
        const response = await $host.post('api/user/login', {
            email, 
            password
        });
        
        if (response.data && response.data.token) {
            localStorage.setItem('token', response.data.token);
            return jwtDecode(response.data.token);
        }
        throw new Error('Некорректный ответ от сервера: отсутствует токен');
    } catch (error) {
        console.error('Login error:', error);
        if (error.response?.data?.message) {
            throw error;
        }
        throw new Error('Ошибка при входе: ' + (error.message || 'неизвестная ошибка'));
    }
};

// Проверка авторизации
export const check = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Токен не найден');
        }

        const response = await $authHost.get('api/user/auth');
        
        if (response.data && response.data.token) {
            localStorage.setItem('token', response.data.token);
            return jwtDecode(response.data.token);
        }
        throw new Error('Некорректный ответ от сервера: отсутствует токен');
    } catch (error) {
        if (error.response?.status !== 401) {
            console.error('Auth check error:', error);
        }
        localStorage.removeItem('token'); // Удаляем невалидный токен
        throw error;
    }
};
