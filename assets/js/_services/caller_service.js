import axios from "axios";
import { userServices } from '../_services/user_services';

console.log(process.env.APP_ENV);
const Axios = axios.create({
    baseURL: process.env.APP_ENV === 'dev' ? 'http://127.0.0.1:8000' : 'https://xtrem-studi.fly.dev'
})

console.dir(Axios)

Axios.interceptors.request.use(request => {
    if(userServices.isConnected()) {
        request.headers.Authorization = 'Bearer ' + userServices.getToken();
        /* request.headers.common['X-CSRF-TOKEN'] = userServices.getToken(); */
    }

    return request;

})

export default Axios;