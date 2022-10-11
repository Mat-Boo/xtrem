import React, { useEffect, useState } from 'react';
import Axios from '../_services/caller_service';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateAlertMessage } from '../redux/redux';
import { userServices } from '../_services/user_services';
import jwt from 'jwt-decode';
import { checkToken } from '../_services/checkToken';

export default function ChangeTempPwd() {

    const navigate = useNavigate();
    const [errors, setErrors] = useState({});

    const dispatchAlertMessage = useDispatch();
    const stockAlertMessageInStore = (data) => {
        dispatchAlertMessage(updateAlertMessage(data))
    }

    useEffect(() => {
        if (userServices.hasChangedTempPwd()) {
            navigate('/accueil');
        }
        document.title = 'Changement de mot de passe | Xtrem';
    }, [])

    // Valid Form and send values to api
    const validForm = (e) => {
        e.preventDefault();
        const formData = new FormData();
        let password = '';
        for (let item of e.target) {
            if (item.name !== '') {
                formData.append(item.name, item.value);
            }
            if (item.name === 'password') {
                password = item.value;
            }
        }
        Axios.post('/api/user/create-password', formData, {
            'content-type': 'multipart/form-data',
          })
        .then(response => {
            stockAlertMessageInStore({type: 'success', content: 'Votre nouveau mot de passe a été créé avec succès.'});
            Axios.post('/api/login', {
                "username": userServices.getUser().username,
                "password": password
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
        })
        .catch(error => {
            if (error.response.data.message = 'Expired JWT Token') {
                stockAlertMessageInStore({type: 'error', content: 'Votre session a expirée, veuillez vous reconnecter.'});
                userServices.logout();
                navigate('/');
            } else {
                stockAlertMessageInStore({type: 'error', content: 'La création de votre mot de passe n\'a pu aboutir, veuillez corriger les erreurs.'})
                setErrors(error.response.data);
            }
        });
    }

    return (
        <>
        {
            <div className='changeTempPwd'>
                <div className='header'>
                    <h1>Créez votre mot de passe personnel</h1>
                </div>
                <div className='pwdMessage'>
                    <p>Pour pouvoir vous connecter à notre interface, vous devez créer votre mot de passe personnel.</p>
                    <p className='rulesTitle'>Règles de création de votre mot de passe : </p>
                    <ul id='pwdRules'>
                        <li>Entre 8 et 20 caractères</li>
                        <li>Au moins une lettre minuscule</li>
                        <li>Au moins une lettre majuscule</li>
                        <li>Au moins 1 chiffre</li>
                        <li>Au moins 1 caractère spécial (- + ! * $ @ % _)</li>
                    </ul>
                </div>
                <form onSubmit={(e) => validForm(e)}>
                    <div className="infosGroup">
                        <div className='formItem'>
                            <label htmlFor="password">Nouveau mot de passe</label>
                            <input type="password" id='password' name='password' style={{border: errors && errors.password !== undefined ? '1px solid #ECACAC' : ''}}/>
                            {
                                errors && errors.password !== undefined ?
                                <p className='errorItem'>{errors.password}</p> :
                                ''
                            }
                        </div>
                        <div className='formItem'>
                            <label htmlFor="passwordConfirm">Confirmation du mot de passe</label>
                            <input type="password" id='passwordConfirm' name='passwordConfirm' style={{border: errors && errors.passwordConfirm !== undefined ? '1px solid #ECACAC' : ''}}/>
                            {
                                errors && errors.passwordConfirm !== undefined ?
                                <p className='errorItem'>{errors.passwordConfirm}</p> :
                                ''
                            }
                        </div>
                    </div>
                    <div className="actionBtns">
                        <button type='submit' id='validateFormBtn' className='validateFormBtn'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-check-lg" viewBox="0 0 16 16">
                                <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"/>
                            </svg>
                            <span>Valider</span>
                        </button>
                    </div>
                </form>
            </div>
        }
        </>
    )
}
