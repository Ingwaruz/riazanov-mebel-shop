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
        throw new Error('Invalid response from server');
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
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
        throw new Error('Invalid response from server');
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

// Проверка авторизации
export const check = async () => {
    try {
        // Проверяем наличие токена
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No token found');
        }

        const response = await $authHost.get('api/user/auth');
        
        if (response.data && response.data.token) {
            localStorage.setItem('token', response.data.token);
            return jwtDecode(response.data.token);
        }
        throw new Error('Invalid response from server');
    } catch (error) {
        // Не логируем ошибку 401, так как это ожидаемое поведение для неавторизованных пользователей
        if (error.response?.status !== 401) {
            console.error('Auth check error:', error);
        }
        throw error;
    }
};
