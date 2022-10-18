import React, { useState, useEffect } from 'react';
import Button from '../../components/Button';
import Axios from '../../_services/caller_service';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateAlertMessage } from '../../redux/redux';
import Loader from '../../components/Loader';

export default function EditAccount() {
    
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    
    const dispatchAlertMessage = useDispatch();
    const stockAlertMessageInStore = (data) => {
        dispatchAlertMessage(updateAlertMessage(data))
    }
    
    const [user, setUser] = useState();

    const [loader, setLoader] = useState(true);
    
    useEffect(() => {
        Axios.get('/api/user')
        .then((response) => {
            setUser(response.data);
            setLoader(false);
        })
        document.title = 'Mon compte | Xtrem';
    }, [])

    const handleChange = (e) => {
        setUser({
            ...user, 
            [e.target.name]: e.target.value
        });
    }

    // Valid Form and send values to api
    const validForm = (e) => {
        e.preventDefault();
        const formData = new FormData();
        for (let item of e.target) {
            if (item.name !== '') {
                formData.append(item.name, item.value);
            }
        }
        Axios.post('/api/user/edit', formData, {
            'content-type': 'multipart/form-data',
          })
        .then(response => {
            stockAlertMessageInStore({type: 'success', content: 'Vos informations personnelles ont été modifiées avec succès.'})
            navigate('/mon-compte');
        })
        .catch(error => {
            stockAlertMessageInStore({type: 'error', content: 'La modification de vos informations personnelles n\'a pu aboutir, veuillez corriger les erreurs.'})
            setErrors(error.response.data);
        });
    }

    return (
        <>
            {
                loader ? 
                    <Loader /> :
                    user &&
                        <div className='editAccount'>
                            <div className='header'>
                                <h1>Modification de mes informations personnelles</h1>
                            </div>
                            <form onSubmit={(e) => validForm(e)}>
                                <div className="infosGroup">
                                    <div className='formItem'>
                                        <label htmlFor="firstname">Prénom</label>
                                        <input type="text" id='firstname' name='firstname' value={user.firstname} onChange={handleChange} style={{border: errors && errors.firstname !== undefined ? '1px solid #ECACAC' : ''}}/>
                                        {
                                            errors && errors.firstname !== undefined ?
                                            <p className='errorItem'>{errors.firstname}</p> :
                                            ''
                                        }
                                    </div>
                                    <div className='formItem'>
                                        <label htmlFor="lastname">Nom</label>
                                        <input type="text" id='lastname' name='lastname' value={user.lastname} onChange={handleChange} style={{border: errors && errors.lastname !== undefined ? '1px solid #ECACAC' : ''}}/>
                                        {
                                            errors && errors.lastname !== undefined ?
                                            <p className='errorItem'>{errors.lastname}</p> :
                                            ''
                                        }
                                    </div>
                                </div>
                                <div className="infosGroup">
                                    <div className='formItem'>
                                        <label htmlFor="email">Email</label>
                                        <input type="email" id='email' name='email' value={user.email} onChange={handleChange} style={{border: errors && errors.email !== undefined ? '1px solid #ECACAC' : ''}}/>
                                        {
                                            errors && errors.email !== undefined ?
                                            <p className='errorItem'>{errors.email}</p> :
                                            ''
                                        }
                                    </div>
                                    {
                                        !user.roles.includes('ROLE_TECHNICAL') &&
                                            <div className='formItem'>
                                                <label htmlFor="phone">Téléphone</label>
                                                <input type="text" id='phone' name='phone' value={user.phone} onChange={handleChange} style={{border: errors && errors.phone !== undefined ? '1px solid #ECACAC' : ''}}/>
                                                {
                                                    errors && errors.phone !== undefined ?
                                                    <p className='errorItem'>{errors.phone}</p> :
                                                    ''
                                                }
                                            </div>
                                    }
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
                                <input type="hidden" name="_csrf_token"
                                    value="{{ csrf_token('authenticate') }}"
                                ></input>
                            </form>
                        </div>
            }
        </>
    )
}
