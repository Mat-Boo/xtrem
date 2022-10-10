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

const hasChangedTempPwd = () => {
    if (!!localStorage.getItem('token')) {
        return getUser().hasChangedTempPwd;
    } else {
        return false;
    }
}

const logout = () => {
    localStorage.removeItem('token');
}

export const userServices = {
    saveToken, isConnected, getToken, getUser, hasChangedTempPwd, logout
};