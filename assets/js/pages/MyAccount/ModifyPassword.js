import React, { useState } from 'react';
import Button from '../../components/Button';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateAlertMessage } from '../../redux/redux';
import {Helmet} from "react-helmet";
import { axiosCaller } from '../../_services/axiosCaller';
import { checkToken } from '../../_services/checkToken';
import { userServices } from '../../_services/user_services';

export default function ModifyPassword() {
    
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});

    const dispatchAlertMessage = useDispatch();
    const stockAlertMessageInStore = (data) => {
        dispatchAlertMessage(updateAlertMessage(data))
    }

    // Validation du formulaire et envoi des valeurs vers l'API
    const validForm = (e) => {
        e.preventDefault();
        if (checkToken.expired()) {
            stockAlertMessageInStore({type: 'error', content: 'Votre session a expirée, veuillez vous reconnecter.'})
            userServices.logout();
            navigate('/');
        } else {
            const formData = new FormData();
            for (let item of e.target) {
                if (item.name !== '') {
                    formData.append(item.name, item.value);
                }
            }
            axiosCaller.askCsrf()
            .then((response) => {
                axiosCaller.callAxios('/api/user/modify-password', 'POST', response.data, formData)
                .then(response => {
                    stockAlertMessageInStore({type: 'success', content: 'Votre mot de passe a été modifié avec succès.'})
                    navigate('/mon-compte');
                })
                .catch(error => {
                    stockAlertMessageInStore({type: 'error', content: 'La modification de votre mot de passe n\'a pu aboutir, veuillez corriger les erreurs.'})
                    setErrors(error.response.data);
                });
            })
        }
    }

    return (
        <>
            <Helmet>
                <title>Mon compte | Xtrem</title>
                <meta name="description" content="Xtrem, modification du mot de passe." />
            </Helmet>
            <div className='modifyPassword'>
                <div className='header'>
                    <h1>Modification de mon mot de passe</h1>
                </div>
                <div className='pwdMessage'>
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
                            <label htmlFor="actualPassword">Mot de passe actuel</label>
                            <input type="password" id='actualPassword' name='actualPassword' style={{border: errors && errors.actualPassword !== undefined ? '1px solid #ECACAC' : ''}}/>
                            {
                                errors && errors.actualPassword !== undefined ?
                                <p className='errorItem'>{errors.actualPassword}</p> :
                                ''
                            }
                        </div>
                    </div>
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
                        <Button 
                            typeBtn='back'
                            btnSvg='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
                                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
                                </svg>'
                            btnTitle='Annuler'
                            btnUrl='/mon-compte'
                            isActive={true}
                        />
                        <button type='submit' className='validateFormBtn'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-check-lg" viewBox="0 0 16 16">
                                <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"/>
                            </svg>
                            <span>Valider</span>
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}