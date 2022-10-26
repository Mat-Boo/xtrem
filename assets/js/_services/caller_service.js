import axios from "axios";
import { userServices } from '../_services/user_services';
import { csrf } from './csrf';

const Axios = axios.create({
    baseURL: process.env.APP_ENV === 'dev' ? 'http://127.0.0.1:8000' : 'https://xtrem-studi.fly.dev'
})

Axios.interceptors.request.use(request => {
    console.log(csrf.getCsrf())
    if(userServices.isConnected()) {
        request.headers.Authorization = 'Bearer ' + userServices.getToken();
        request.headers.common['X-CSRF-TOKEN'] = csrf.getCsrf();
    }

    return request;

})

export default Axios;