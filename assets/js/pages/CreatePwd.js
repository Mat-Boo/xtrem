import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateAlertMessage } from '../redux/redux';
import { Helmet } from "react-helmet";
import { axiosCaller } from '../_services/axiosCaller';

export default function CreatePwd() {

    const navigate = useNavigate();
    const [errors, setErrors] = useState({});

    const dispatchAlertMessage = useDispatch();
    const stockAlertMessageInStore = (data) => {
        dispatchAlertMessage(updateAlertMessage(data))
    }

    const uuid = useParams().uuid;

    // Validation du formulaire et envoi des valeurs vers l'API
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
        axiosCaller.callAxiosDisconnect('/api/user/create-password/' + uuid, 'POST', formData)
        .then(response => {
            stockAlertMessageInStore({ type: 'success', content: 'Votre nouveau mot de passe a été créé avec succès.\nVous pouvez vous connecter' });
            navigate('/');
        })
        .catch(error => {
            stockAlertMessageInStore({ type: 'error', content: 'La création de votre mot de passe n\'a pu aboutir, veuillez corriger les erreurs.' })
            setErrors(error.response.data);
        });
    }

    return (
        <>
            <Helmet>
                <title>Changement de mot de passe | Xtrem</title>
                <meta name="description" content="Xtrem, page de création d'un nouveau mot de passe pour pouvoir se connecter à l'interface Xtrem." />
            </Helmet>
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
                                <input type="password" id='password' name='password' style={{ border: errors && errors.password !== undefined ? '1px solid #ECACAC' : '' }} />
                                {
                                    errors && errors.password !== undefined ?
                                        <p className='errorItem'>{errors.password}</p> :
                                        ''
                                }
                            </div>
                            <div className='formItem'>
                                <label htmlFor="passwordConfirm">Confirmation du mot de passe</label>
                                <input type="password" id='passwordConfirm' name='passwordConfirm' style={{ border: errors && errors.passwordConfirm !== undefined ? '1px solid #ECACAC' : '' }} />
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
                                    <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z" />
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
