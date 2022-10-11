import { userServices } from './user_services';

const expired = () => {
    if (userServices.isConnected()) {
        if (Date.now() > userServices.getUser().exp * 1000) {
            userServices.logout();
            return true;
        } else {
            return false;
        }
    }
}

export const checkToken = {
    expired
};