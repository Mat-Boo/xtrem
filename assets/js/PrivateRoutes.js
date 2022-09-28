import React from 'react';
import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

export default function PrivateRoutes() {

    /* let auth = {'token': true} */
    let auth = false;
    if (localStorage.getItem('token')) {
        auth = true
    }
    console.log(auth)

    return (
        auth ? <Outlet/> : <Navigate to='/' />
    )
}
