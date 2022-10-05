import React from 'react';
import { useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateAlertMessage } from '../redux/redux';
import { userServices } from '../_services/user_services';

export default function PrivateRoutes() {

    let roles = userServices.getUser().roles;

    const dispatchAlertMessage = useDispatch();
    const stockAlertMessageInStore = (data) => {
        dispatchAlertMessage(updateAlertMessage(data))
    }
    useEffect(() => {
        if (!roles.includes('ROLE_TECHNICAL')) {
            stockAlertMessageInStore({type: 'error', content: 'Vous n\'êtes pas autorisé à accéder à cette page.'})
        }
    }, [])

    return (
        roles.includes('ROLE_TECHNICAL') ? <Outlet/> : <Navigate to='/'/>
    )
}
