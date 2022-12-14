import React, { useState, useEffect }  from 'react';
import Button from '../../../components/Button';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateAlertMessage, updateLoader } from '../../../redux/redux';
import Loader from '../../../components/Loader';
import {Helmet} from "react-helmet";
import { axiosCaller } from '../../../_services/axiosCaller';
import { userServices } from '../../../_services/user_services';
import { checkToken } from '../../../_services/checkToken';

export default function AddPermission() {
    
    const [permission, setPermission] = useState([]);
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});

    const dispatchAlertMessage = useDispatch();
    const stockAlertMessageInStore = (data) => {
        dispatchAlertMessage(updateAlertMessage(data))
    }

    const id = useParams().idSlug.substring(0, useParams().idSlug.indexOf('-', 0));

    // Gestion du loader, gif s'affichant pendant l'appel d'Axios avant le retour de sa réponse
    const [loader, setLoader] = useState(true);
    const dispatchLoader = useDispatch();
    const stockLoaderInStore = (data) => {
        dispatchLoader(updateLoader(data))
    }
    
    useEffect(() => {
        stockLoaderInStore(true);
        axiosCaller.askCsrf()
        .then((response) => {
            axiosCaller.callAxios('/api/permission/' + id, 'GET', response.data)
            .then((response) => {
                setPermission(response.data);
                setLoader(false);
                stockLoaderInStore(false);
            })
        })
    }, [])

    const handleChange = (e) => {
        setPermission({
            ...permission, 
            [e.target.name]: e.target.value
        });
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
                axiosCaller.callAxios('/api/permission/' + id + '/edit', 'POST', response.data, formData)
                .then(response => {
                    stockAlertMessageInStore({type: 'success', content: 'La permission <b>' + response.data.name + '</b> a été modifiée avec succès.'})
                    navigate('/permissions');
                })
                .catch(error => {
                    stockAlertMessageInStore({type: 'error', content: 'La modification de la permission n\'a pu aboutir, veuillez corriger les erreurs.'})
                    setErrors(error.response.data);
                });
            })
        }
    }

    return (
        <>
            <Helmet>
                <title>Modification permission | Xtrem</title>
                <meta name="description" content="Xtrem, modification des informations d'une permission globale." />
            </Helmet>
            {
                loader ? 
                    <Loader /> :
                permission.name &&
                    <div className='editPermission'>
                        <div className='header'>
                            <h1>Edition de la permission {permission.id}</h1>
                        </div>
                        <form onSubmit={(e) => validForm(e)}>
                            <div className='formItem'>
                                <label htmlFor="name">Nom</label>
                                <input type="text" id='name' name='name' value={permission.name} onChange={handleChange} style={{border: errors && errors.name !== undefined ? '1px solid #ECACAC' : ''}}/>
                                {
                                    errors && errors.name !== undefined ?
                                    <p className='errorItem'>{errors.name}</p> :
                                    ''
                                }
                            </div>
                            <div className='formItem description'>
                                <label htmlFor="description">Description</label>
                                <textarea name="description" id="description" cols="30" rows="5" value={permission.description} onChange={handleChange} style={{border: errors && errors.description !== undefined ? '1px solid #ECACAC' : ''}}></textarea>
                                {
                                    errors && errors.description !== undefined ?
                                    <p className='errorItem'>{errors.description}</p> :
                                    ''
                                }
                            </div>
                            <div className='actionBtns'>
                                <Button 
                                    typeBtn='back'
                                    btnSvg='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
                                        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
                                        </svg>'
                                    btnTitle='Annuler'
                                    btnUrl='/permissions'
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
            }
        </>
    )
}