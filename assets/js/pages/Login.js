import React, { useState } from 'react';
import logo from '../../img/logo_horizontal.png';
import Axios from '../_services/caller_service';
import { useDispatch } from 'react-redux'
import { updateAlertMessage } from '../redux/redux';
import { useNavigate } from 'react-router-dom';
import jwt from 'jwt-decode';
import { useEffect } from 'react';
import { userServices } from '../_services/user_services';

export default function Login() {
    
    const navigate = useNavigate();

    const dispatchAlertMessage = useDispatch();
    const stockAlertMessageInStore = (data) => {
        dispatchAlertMessage(updateAlertMessage(data))
    }

    useEffect(() => {
        if(userServices.isConnected()) {
            navigate('/accueil');
        }
    }, [])

    // Valid Form and send values to api
    const validForm = (e) => {
        e.preventDefault();
        let formValues = {};
        for (let item of e.target) {
            if (item.name !== '') {
                formValues[item.name] = item.value;
            }
        }
        Axios.post('/api/login', {
            "username": formValues.email,
            "password": formValues.password
        })
        .then(response => {
            userServices.saveToken(response.data.token);
            stockAlertMessageInStore({type: 'info', content: 'Bienvenue <b>' + jwt(response.data.token).firstname}) + '</b>';
            navigate('/accueil');
        })
        .catch(error => {
            if (error.response.data.message === 'Invalid credentials.') {
                stockAlertMessageInStore({type: 'error', content: 'Veuillez vérifier votre email et/ou votre mot de passe.'});
            } else {
                stockAlertMessageInStore({type: 'error', content: 'Compte inactif, vous serez informé par email lorsque vous pourrez vous connecter.'});
            }
        });
    }

    return (
        <div className='login'>
            <img src={logo} alt="logo" className='logo'/>
            <form id='loginForm' onSubmit={(e) => validForm(e)}>
                <div className='formItem'>
                    <label htmlFor="email">Email</label>
                    <input type="email" id='email' name='email' />
                </div>
                <div className='formItem'>
                    <label htmlFor="password">Mot de passe</label>
                    <input type="password" id='password' name='password' />
                </div>
                <button type='submit' className='validateFormBtn' id='validateFormBtn'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-check-lg" viewBox="0 0 16 16">
                        <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"/>
                    </svg>
                    <span>Valider</span>
                </button>
            </form>
        </div>
    )
}