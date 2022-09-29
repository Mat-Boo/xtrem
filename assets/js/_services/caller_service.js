import axios from "axios";
import { userServices } from '../_services/user_services';

const Axios = axios.create({
    baseURL: 'http://127.0.0.1:8000'/* ,
    headers: {'Authorization': 'Bearer ' + userServices.isConnected() ? userServices.getToken() : null} */
})

Axios.interceptors.request.use(request => {
    if(userServices.isConnected()) {
        request.headers.Authorization = 'Bearer ' + userServices.getToken();
    }

    return request;

})

export default Axios;