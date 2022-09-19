import React, { useState } from 'react';
import Button from '../../components/Button';
import axios from 'axios';
import { useDispatch } from 'react-redux'
import { updateMessage } from '../../redux/redux';
import { useNavigate } from 'react-router-dom';
import AlertMessage from '../../components/AlertMessage';

export default function AddPermission() {

    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
    const [errors, setErrors] = useState({});

    const dispatchMessage = useDispatch();
    const stockInStore = (data) => {
        dispatchMessage(updateMessage(data))
    }

    // Valid Form and send values to api
    const validForm = (e) => {
        e.preventDefault();
        let formValues = {};
        for (let item of e.target) {
            if (item.name !== '') {
                formValues[item.name] = item.value;
            }
        }
        axios.post('http://127.0.0.1:8000/api/permissions/create', {formValues})
        .then(response => {
            stockInStore({type: 'success', content: 'La nouvelle permission a été créée avec succès.'})
            navigate('/permissions');
        })
        .catch(error => {
            setErrorMessage('L\'ajout de la permission n\'a pu aboutir, merci de réessayer.')
            setErrors(error.response.data);
        });
    }

    return (
        <div className='addPermission'>
            <div className='header'>
                <h1>Nouvelle permission</h1>
            </div>
            {
                errorMessage !== '' ?
                <AlertMessage type='error' message={errorMessage} /> :
                ''
            }
            <form onSubmit={(e) => validForm(e)}>
                <div className='formItem'>
                    <label htmlFor="name">Nom</label>
                    <input type="text" id='name' name='name' style={{border: errors && errors.name !== undefined ? '1px solid #ECACAC' : ''}}/>
                    {
                        errors && errors.name !== undefined ?
                        <p className='errorItem'>{errors.name}</p> :
                        ''
                    }
                </div>
                <div className='formItem description'>
                    <label htmlFor="description">Description</label>
                    <textarea name="description" id="description" cols="30" rows="5" style={{border: errors && errors.description !== undefined ? '1px solid #ECACAC' : ''}}></textarea>
                    {
                        errors && errors.description !== undefined ?
                        <p className='errorItem'>{errors.description}</p> :
                        ''
                    }
                </div>
                <div className='actionBtns'>
                    <Button 
                        type='back'
                        btnSvg='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
                            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
                            </svg>'
                        btnTitle='Annuler'
                        btnUrl='/permissions'
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
    )
}
