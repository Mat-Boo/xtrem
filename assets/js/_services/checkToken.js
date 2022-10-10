/* import { useDispatch } from 'react-redux';
import { updateAlertMessage } from '../redux/redux'; */
import { userServices } from './user_services';


/* const dispatchAlertMessage = useDispatch();
    const stockAlertMessageInStore = (data) => {
        dispatchAlertMessage(updateAlertMessage(data))
    } */

const expired = () => {
    if (Date.now() > userServices.getUser().exp * 1000) {
        userServices.logout();
        /* stockAlertMessageInStore({type: 'error', content: 'Votre session a expirée, veuillez vous reconnecter.'}) */
        return true;
    } else {
        return false;
    }
}

export const checkToken = {
    expired
};