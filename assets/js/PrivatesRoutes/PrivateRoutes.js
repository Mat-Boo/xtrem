import React, { useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateAlertMessage } from '../redux/redux';
import { userServices } from '../_services/user_services';

export default function PrivateRoutes() {

    let auth = userServices.isConnected();
    let hasChangedTempPwd = userServices.hasChangedTempPwd();

    const dispatchAlertMessage = useDispatch();
    const stockAlertMessageInStore = (data) => {
        dispatchAlertMessage(updateAlertMessage(data))
    }
    useEffect(() => {
        if (!auth) {
            stockAlertMessageInStore({type: 'error', content: 'Veuillez vous connecter pour accéder à cette page.'})
        } else if (!hasChangedTempPwd) {
            stockAlertMessageInStore({type: 'error', content: 'Vous n\'êtes pas autorisé à accéder à cette page.'})
        }
    }, [])

    return (
        auth && hasChangedTempPwd ? <Outlet/> : <Navigate to='/'/>
    )
}
