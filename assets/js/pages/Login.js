import React from 'react';
import logo from '../../img/logo_horizontal.png';
import { useDispatch } from 'react-redux'
import { updateAlertMessage } from '../redux/redux';
import { useNavigate } from 'react-router-dom';
import jwt from 'jwt-decode';
import { useEffect } from 'react';
import { userServices } from '../_services/user_services';
import { Helmet } from "react-helmet";
import { axiosCaller } from '../_services/axiosCaller';

export default function Login() {

    const navigate = useNavigate();

    const dispatchAlertMessage = useDispatch();
    const stockAlertMessageInStore = (data) => {
        dispatchAlertMessage(updateAlertMessage(data))
    }

    useEffect(() => {
        if (userServices.isConnected()) {
            navigate('/accueil');
        }
    }, [])

    // Validation du formulaire et envoi des valeurs vers l'API
    const validForm = (e) => {
        e.preventDefault();
        let formValues = {};
        for (let item of e.target) {
            if (item.name !== '') {
                formValues[item.name] = item.value;
            }
        }
        axiosCaller.callAxiosDisconnect('/api/login', 'POST', {
            "username": formValues.email,
            "password": formValues.password
        })
        .then(response => {
            userServices.saveToken(response.data.token);
            stockAlertMessageInStore({ type: 'info', content: 'Bienvenue <b>' + jwt(response.data.token).firstname }) + '</b>';
            navigate('/accueil');
        })
        .catch(error => {
            if (error.response.data.message === 'Identifiants invalides.') {
                stockAlertMessageInStore({ type: 'error', content: 'Veuillez vérifier votre email et/ou votre mot de passe.' });
            } else if (error.response.data.detail === 'App\\Entity\\User::getPassword(): Return value must be of type string, null returned') {
                stockAlertMessageInStore({ type: 'error', content: 'Votre compte est bien créé mais vous n\'avez pas encore créé votre mot de passe personnel.\nVeuillez vous référer au mail que vous avez reçu de la part de Xtrem.' });
            } else {
                stockAlertMessageInStore({ type: 'error', content: 'Compte inactif, vous serez informé par email lorsque vous pourrez vous connecter.' });
            }
        });
    }

    return (
        <>
            <Helmet>
                <title>Connexion | Xtrem</title>
                <meta name="description" content="Xtrem, page de connexion à l'interface Xtrem." />
            </Helmet>
            <div className='login'>
                <img src={logo} alt="logo" className='logo' />
                <form noValidate id='loginForm' onSubmit={(e) => validForm(e)}>
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
                            <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z" />
                        </svg>
                        <span>Valider</span>
                    </button>
                    <a href='/mot-de-passe-oublie' className='forgottenPwdLink'>Mot de passe oublié ?</a>
                </form>
            </div>
        </>
    )
}