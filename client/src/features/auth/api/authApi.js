import { $authHost, $host } from '../../../shared/api';
import { jwtDecode } from 'jwt-decode';

export const login = async (email, password) => {
    try {
        const { data } = await $host.post('api/user/login', { email, password });
        localStorage.setItem('token', data.token);
        return jwtDecode(data.token);
    } catch (e) {
        throw e;
    }
};

export const registration = async (email, password, verified = false) => {
    try {
        const { data } = await $host.post('api/user/registration', { 
            email, 
            password,
            verified,
            role: 'USER'
        });
        localStorage.setItem('token', data.token);
        return jwtDecode(data.token);
    } catch (e) {
        throw e;
    }
};

export const sendVerificationPin = async (email) => {
    try {
        const { data } = await $host.post('api/user/send-verification-pin', { email });
        return data;
    } catch (e) {
        throw e;
    }
};

export const verifyPin = async (email, pin_code) => {
    try {
        const { data } = await $host.post('api/user/verify-pin', { email, pin_code });
        return data;
    } catch (e) {
        throw e;
    }
};

export const check = async () => {
    try {
        const { data } = await $authHost.get('api/user/auth');
        localStorage.setItem('token', data.token);
        return jwtDecode(data.token);
    } catch (e) {
        localStorage.removeItem('token');
        throw e;
    }
}; 