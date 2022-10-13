import React from 'react';
import { useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateAlertMessage } from '../redux/redux';
import { userServices } from '../_services/user_services';

export default function PrivateCreatePwdRoutes() {

    let isConnected = userServices.isConnected();

    const dispatchAlertMessage = useDispatch();
    const stockAlertMessageInStore = (data) => {
        dispatchAlertMessage(updateAlertMessage(data))
    }
    useEffect(() => {
        if (isConnected) {
            stockAlertMessageInStore({type: 'error', content: 'Vous n\'êtes pas autorisé à accéder à cette page.'})
        }
    }, [])

    return (
        !isConnected ? <Outlet/> : <Navigate to='/accueil'/>
    )
}