import React, { useState } from 'react';
import logo from '../../img/logo_horizontal.png';
import axios from 'axios';
import { useDispatch } from 'react-redux'
import { updateAuth } from '../redux/redux';
import { useNavigate } from 'react-router-dom';
import AlertMessage from '../components/AlertMessage';

export default function Login() {
    
    const dispatch = useDispatch();
    const stockInStore = (data) => {
        dispatch(updateAuth(data))
    }

    const navigate = useNavigate();

    const [errorMessage, setErrorMessage] = useState('');

    // Valid Form and send values to api
    const validForm = (e) => {
        e.preventDefault();
        let formValues = {};
        for (let item of e.target) {
            if (item.name !== '') {
                formValues[item.name] = item.value;
            }
        }
        axios.post('http://127.0.0.1:8000/api/login', {
            "username": formValues.email,
            "password": formValues.password
        })
        .then(response => {
            stockInStore(response.data);
            navigate('/accueil');
        })
        .catch(error => {
            setErrorMessage('Veuillez vérifier votre email et/ou votre mot de passe.')
        });
    }

    return (
        <div className='login'>
            <img src={logo} alt="logo" className='logo'/>
            {
                errorMessage !== '' ?
                <AlertMessage type='error' message={errorMessage} /> :
                ''
            }
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