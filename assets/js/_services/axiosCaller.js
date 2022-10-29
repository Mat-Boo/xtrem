import axios from "axios";
import { userServices } from './user_services';

let baseUrl = process.env.APP_ENV === 'dev' ? 'http://127.0.0.1:8000' : /* 'https://xtrem-studi.fly.dev' */'https://xtrem-studi.herokuapp.com';

const callAxiosDisconnect = (path, method, formData) => {
    return axios(baseUrl + path, {
        method: method,
        headers: {
            'content-type': 'application/json'
        },
        data: formData
    })
}

const askCsrf = () => {
    return axios.get(baseUrl + '/api/csrf', {
        headers: {
            Authorization: 'Bearer ' + userServices.getToken()
        }
    })
}

const callAxios = (path, method, csrfToken, formData) => {
    console.log(baseUrl);
    return axios(baseUrl + path, {
        method: method,
        headers: {
            Authorization: 'Bearer ' + userServices.getToken(),
            'X-CSRF-TOKEN': csrfToken,
            'content-type': method === 'POST' ? 'multipart/form-data' : 'application/json'
        },
        data: formData
    })   
}

export const axiosCaller = {
    callAxiosDisconnect, askCsrf, callAxios
};