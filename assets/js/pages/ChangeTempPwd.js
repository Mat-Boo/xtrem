import React, { useEffect, useState } from 'react';
import Button from '../components/Button';
import Axios from '../_services/caller_service';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateAlertMessage } from '../redux/redux';
import slugify from 'react-slugify';
import { userServices } from '../_services/user_services';

export default function ChangeTempPwd() {

    const navigate = useNavigate();
    const [errors, setErrors] = useState({});

    const dispatchAlertMessage = useDispatch();
    const stockAlertMessageInStore = (data) => {
        dispatchAlertMessage(updateAlertMessage(data))
    }

    useEffect(() => {
        document.title = 'Changement de mot de passe | Xtrem';
        if (userServices.getUser().hasChangedTempPwd) {
            navigate('/accueil');
        }
    }, [])

    // Valid Form and send values to api
    const validForm = (e) => {
        e.preventDefault();
        const formData = new FormData();
        for (let item of e.target) {
            if (item.name !== '') {
                formData.append(item.name, item.value);
            }
        }
        Axios.post('/api/partner/' + id + '/reset-password', formData, {
            'content-type': 'multipart/form-data',
          })
        .then(response => {
            console.log(response)
            stockAlertMessageInStore({type: 'success', content: 'Le mot de passe de <b>' + response.data.contact.firstname + ' ' +  response.data.contact.lastname + '</b>, contact du partenaire <b>' + response.data.name + '</b>, a été modifié avec succès.'})
            navigate('/accueil');
        })
        .catch(error => {
            stockAlertMessageInStore({type: 'error', content: 'La modification du mot de passe n\'a pu aboutir, veuillez corriger les erreurs.'})
            setErrors(error.response.data);
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
                    <p className='rulesTitle'>Règle de création de votre mot de passe : </p>
                    <ul id='pwdRules'>
                        <li>Entre 8 et 20 caractères</li>
                        <li>Au moins une lettre minuscule</li>
                        <li>Au moins une lettre majuscule</li>
                        <li>Au moins 1 chiffre</li>
                        <li>Au moins 1 caractères spécial (- + ! * $ @ % _)</li>
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
