import React, { useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateAlertMessage, updateAnswerModalForChangeState, updateAnswerModalForDelete, updateAuth, updateAxiosAnswer, updateFilter, updateModal, updateStateItem, updateTypeButton } from '../redux/redux';
import { userServices } from '../_services/user_services';
import { checkToken } from '../_services/checkToken';

export default function PrivateRoutes() {

    //redux store : On déclare tout les slices pour ensuite les réinitialiser si token expiré
    const dispatchAuth = useDispatch();
    const dispatchModal = useDispatch();
    const dispatchAnswerModalForChangeState = useDispatch();
    const dispatchAnswerModalForDelete = useDispatch();
    const dispatchTypeButton = useDispatch();
    const dispatchFilter = useDispatch();
    const dispatchStateItem = useDispatch();
    const dispatchAxiosAnswer = useDispatch();
    const stockInStore = (data, dataFilter) => {
        dispatchAuth(updateAuth(data)),
        dispatchModal(updateModal(data)),
        dispatchAnswerModalForChangeState(updateAnswerModalForChangeState(data)),
        dispatchAnswerModalForDelete(updateAnswerModalForDelete(data)),
        dispatchTypeButton(updateTypeButton(data)),
        dispatchFilter(updateFilter(dataFilter)),
        dispatchStateItem(updateStateItem(data)),
        dispatchAxiosAnswer(updateAxiosAnswer(data))
    }

    let auth = userServices.isConnected();
    let hasChangedTempPwd = userServices.hasChangedTempPwd();

    let expiredToken = checkToken.expired();

    const location = useLocation();

    const dispatchAlertMessage = useDispatch();
    const stockAlertMessageInStore = (data) => {
        dispatchAlertMessage(updateAlertMessage(data))
    }
    useEffect(() => {
        if (!auth) {
            stockAlertMessageInStore({type: 'error', content: 'Veuillez vous connecter pour accéder à cette page.'})
        } else if (expiredToken) {
            stockAlertMessageInStore({type: 'error', content: 'Votre session a expirée, veuillez vous reconnecter.'})
            stockInStore('', {search: '', state: 'all'});
            userServices.logout();
        } else if (!hasChangedTempPwd) {
            stockAlertMessageInStore({type: 'error', content: 'Vous n\'êtes pas autorisé à accéder à cette page.'})
        }
    }, [location])

    return (
        auth && hasChangedTempPwd && !expiredToken ? <Outlet/> : <Navigate to='/'/>
    )
}
