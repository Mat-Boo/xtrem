import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';

export default function PrivateRoutes() {

    let auth = !!localStorage.getItem('token');

    return (
        auth ? <Outlet/> : <Navigate to='/' />
    )
}
