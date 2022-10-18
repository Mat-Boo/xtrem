import axios from "axios";
import { userServices } from '../_services/user_services';

const Axios = axios.create({
    baseURL: 'https://xtrem-studi.herokuapp.com/'
})

Axios.interceptors.request.use(request => {
    if(userServices.isConnected()) {
        request.headers.Authorization = 'Bearer ' + userServices.getToken();
        /* request.headers.common['X-CSRF-TOKEN'] = userServices.getToken(); */
    }

    return request;

})

export default Axios;