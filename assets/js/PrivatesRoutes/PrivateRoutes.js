import React, { useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { 
    updateAlertMessage, updateAnswerModalForChangeState, 
    updateAnswerModalForDelete, updateAnswerModalForResetAccess, 
    updateAxiosAnswer, updateCsrf, updateFilter, updateLoader, 
    updateModal, updateStateItem, updateTypeButton
} from '../redux/redux';
import { userServices } from '../_services/user_services';
import { checkToken } from '../_services/checkToken';

export default function PrivateRoutes() {

    //redux store : On déclare toutes les slices pour ensuite les réinitialiser si token expiré
    const dispatchModal = useDispatch();
    const dispatchAnswerModalForChangeState = useDispatch();
    const dispatchAnswerModalForDelete = useDispatch();
    const dispatchAnswerModalForResetAccess = useDispatch();
    const dispatchTypeButton = useDispatch();
    const dispatchFilter = useDispatch();
    const dispatchStateItem = useDispatch();
    const dispatchAxiosAnswer = useDispatch();
    const dispatchLoader = useDispatch();
    const stockInStore = (data, dataFilter) => {
        dispatchModal(updateModal(data)),
        dispatchAnswerModalForChangeState(updateAnswerModalForChangeState(data)),
        dispatchAnswerModalForDelete(updateAnswerModalForDelete(data)),
        dispatchAnswerModalForResetAccess(updateAnswerModalForResetAccess(data)),
        dispatchTypeButton(updateTypeButton(data)),
        dispatchFilter(updateFilter(dataFilter)),
        dispatchStateItem(updateStateItem(data)),
        dispatchAxiosAnswer(updateAxiosAnswer(data)),
        dispatchLoader(updateLoader(data))
    }

    const location = useLocation();

    const dispatchAlertMessage = useDispatch();
    const stockAlertMessageInStore = (data) => {
        dispatchAlertMessage(updateAlertMessage(data))
    }

    useEffect(() => {
        if (!userServices.isConnected()) {
            stockAlertMessageInStore({type: 'error', content: 'Veuillez vous connecter pour accéder à cette page.'})
        } else if (checkToken.expired()) {
            stockAlertMessageInStore({type: 'error', content: 'Votre session a expirée, veuillez vous reconnecter.'})
            stockInStore('', {search: '', state: 'all'});
            userServices.logout();
        }

    }, [location])

    return (
        userServices.isConnected() && !checkToken.expired() ? <Outlet/> : <Navigate to='/'/>
    )
}
