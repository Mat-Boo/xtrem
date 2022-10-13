import jwt from 'jwt-decode';

const saveToken = (token) => {
    localStorage.setItem('token', token);
}

const isConnected = () => {
    return !!localStorage.getItem('token');
}

const getToken = () => {
    return localStorage.getItem('token');
}

const getUser = () => {
    return jwt(localStorage.getItem('token'));
}

const logout = () => {
    localStorage.removeItem('token');
}

export const userServices = {
    saveToken, isConnected, getToken, getUser, logout
};