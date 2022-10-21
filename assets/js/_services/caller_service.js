import axios from "axios";
import { userServices } from '../_services/user_services';

const Axios = axios.create({
    baseURL: process.env.APP_ENV === 'dev' ? 'http://127.0.0.1:8000' : 'https://xtrem-studi.fly.dev'
})

Axios.interceptors.request.use(request => {
    if(userServices.isConnected()) {
        request.headers.Authorization = 'Bearer ' + userServices.getToken();
    }

    return request;

})

export default Axios;