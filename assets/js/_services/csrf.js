import axios from "axios";
import { userServices } from '../_services/user_services';

let csrfToken = '';
const getCsrf = () => {
    axios.get((process.env.APP_ENV === 'dev' ? 'http://127.0.0.1:8000' : 'https://xtrem-studi.fly.dev') + '/api/csrf', {
        headers: {
            Authorization: 'Bearer ' + userServices.getToken()
        }
    })
    .then((response) => {
        csrfToken = response.data
    })
    return csrfToken;
}
    
export const csrf = {
    getCsrf
};