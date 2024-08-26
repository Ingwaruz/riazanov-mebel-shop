import {$authHost, $host} from "./index";

// Регистрация пользователя
export const registration = async (email, password) => {
    try {
        const response = await $host.post('api/user/registration', {email, password, role: 'ADMIN'});
        return response;
    } catch (e) {
        console.error('Error during registration:', e);
        throw e;
    }
}

// Логин пользователя
export const login = async (email, password) => {
    try {
        const response = await $host.post('api/user/login', {email, password});
        return response;
    } catch (e) {
        console.error('Error during login:', e);
        throw e;
    }
}

// Проверка авторизации
export const check = async () => {
    try {
        const response = await $authHost.get('api/auth/check');
        return response;
    } catch (e) {
        console.error('Error during auth check:', e);
        throw e;
    }
}
