import React from 'react';
import { useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateAlertMessage } from '../redux/redux';
import { userServices } from '../_services/user_services';

export default function PrivateChangeTempPwdRoutes() {

    let auth = userServices.isConnected();
    let hasChangedTempPwd = userServices.hasChangedTempPwd();

    const dispatchAlertMessage = useDispatch();
    const stockAlertMessageInStore = (data) => {
        dispatchAlertMessage(updateAlertMessage(data))
    }
    useEffect(() => {
        if (!auth) {
            stockAlertMessageInStore({type: 'error', content: 'Veuillez vous connecter pour accéder à cette page.'})
        }
        if (hasChangedTempPwd) {
            stockAlertMessageInStore({type: 'error', content: 'Vous n\'êtes pas autorisé à accéder à cette page.'})
        }
    }, [])

    return (
        !hasChangedTempPwd ? <Outlet/> : <Navigate to='/accueil'/>
    )
}



//REGENEER TOKEN APRES CREATE PASSWORD car l'actuel contient encore le hasChangedTempPwd a false !!!