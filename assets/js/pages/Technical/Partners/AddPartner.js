import React, { useState, useEffect } from 'react';
import Button from '../../../components/Button';
import { useDispatch } from 'react-redux'
import { updateAlertMessage, updateLoader } from '../../../redux/redux';
import { useNavigate } from 'react-router-dom';
import ToggleSwitch from '../../../components/ToggleSwitch';
import { userServices } from '../../../_services/user_services';
import Loader from '../../../components/Loader';
import {Helmet} from "react-helmet";
import { axiosCaller } from '../../../_services/axiosCaller';
import { checkToken } from '../../../_services/checkToken';

export default function AddPartner() {
       
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    
    const dispatchAlertMessage = useDispatch();
    const stockAlertMessageInStore = (data) => {
        dispatchAlertMessage(updateAlertMessage(data))
    }

    const [logoFile, setLogoFile] = useState();
    const handleLogoFile = (e) => {
        setLogoFile(e.target.files[0])
    }
    
    const [permissions, setPermissions] = useState([]);

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
            axiosCaller.callAxios('/api/permissions', 'GET', response.data)
            .then((response) => {
                setPermissions(response.data);
                setLoader(false);
                stockLoaderInStore(false);
            })
        })
      }, [])

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
                if (item.name === 'logo' && logoFile) {
                    formData.append('logoFile', logoFile);
                    formData.append('logoFileName', logoFile.name);
                } else if (item.name === 'permission') {
                    formData.append('permissions[' + item.id + ']', item.checked ? 1 : 0);
                } else if (item.id !== '') {
                    formData.append(item.id, item.value);
                }
            }
            axiosCaller.askCsrf()
            .then((response) => {
                axiosCaller.callAxios('/api/partner/create', 'POST', response.data, formData)
                .then(response => {
                    stockAlertMessageInStore({type: 'success', content: 'Le nouveau partenaire <b>' + response.data.name + '</b> a été créé avec succès.'})
                    navigate('/partenaires');
                })
                .catch(error => {
                    stockAlertMessageInStore({type: 'error', content: 'L\'ajout du partenaire n\'a pu aboutir, veuillez corriger les erreurs.'});
                    setErrors(error.response.data);
                });
            })
        }
    }

    return (
        <>
            <Helmet>
                <title>Ajout partenaires | Xtrem</title>
                <meta name="description" content="Xtrem, création d'un partenaire avec affectations des permissions globales." />
            </Helmet>
            {
                loader ? 
                    <Loader /> :
                    permissions[0] &&
                        <div className='addPartner'>
                            <div className='header'>
                                <h1>Nouveau partenaire</h1>
                            </div>
                            <form noValidate onSubmit={(e) => validForm(e)}>
                                <div id='nameLogo'>
                                    <div className='formItem'>
                                        <label htmlFor="name">Nom</label>
                                        <input type="text" id='name' name='name' style={{border: errors && errors.name !== undefined ? '1px solid #ECACAC' : ''}}/>
                                        {
                                            errors && errors.name !== undefined ?
                                            <p className='errorItem'>{errors.name}</p> :
                                            ''
                                        }
                                    </div>
                                    <div>
                                        <div className='formItem logo'>
                                            <p className='logoRules'>Format PNG ou JPG | Max. 1Mo</p>
                                            <input type="file" id='logo' name='logo' onChange={(e) => handleLogoFile(e)} />
                                            <label id='logoLabel' htmlFor="logo"  style={{border: errors && errors.logo !== undefined ? '1px solid #ECACAC' : ''}}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-upload" viewBox="0 0 16 16">
                                                    <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                                                    <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"/>
                                                </svg>
                                                Ajouter un logo
                                            </label>
                                            {
                                                errors && errors.logo !== undefined ?
                                                <p className='errorItem'>{errors.logo}</p> :
                                                ''
                                            }
                                        </div>
                                        <p>{logoFile ? logoFile.name : ''}</p>
                                    </div>
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
                                <fieldset>
                                    <legend>Contact</legend>
                                    <div className='contactGroup'>
                                        <div className='formItem'>
                                            <label htmlFor="firstname">Prénom</label>
                                            <input type="text" id='firstname' name='firstname' style={{border: errors && errors.firstname !== undefined ? '1px solid #ECACAC' : ''}}/>
                                        {
                                            errors && errors.firstname !== undefined ?
                                            <p className='errorItem'>{errors.firstname}</p> :
                                            ''
                                        }
                                        </div>
                                        <div className='formItem'>
                                            <label htmlFor="lastname">Nom</label>
                                            <input type="text" id='lastname' name='lastname' style={{border: errors && errors.lastname !== undefined ? '1px solid #ECACAC' : ''}}/>
                                        {
                                            errors && errors.lastname !== undefined ?
                                            <p className='errorItem'>{errors.lastname}</p> :
                                            ''
                                        }
                                        </div>
                                    </div>
                                    <div className='contactGroup'>
                                        <div className='formItem'>
                                            <label htmlFor="phone">Téléphone</label>
                                            <input type="tel" id='phone' name='phone' style={{border: errors && errors.phone !== undefined ? '1px solid #ECACAC' : ''}}/>
                                        {
                                            errors && errors.phone !== undefined ?
                                            <p className='errorItem'>{errors.phone}</p> :
                                            ''
                                        }
                                        </div>
                                        <div className='formItem'>
                                            <label htmlFor="email">Email</label>
                                            <input type="email" id='email' name='email' title="" style={{border: errors && errors.email !== undefined ? '1px solid #ECACAC' : ''}}/>
                                        {
                                            errors && errors.email !== undefined ?
                                            <p className='errorItem'>{errors.email}</p> :
                                            ''
                                        }
                                        </div>
                                    </div>
                                </fieldset>
                                <fieldset>
                                    <legend>Permissions Globales</legend>
                                    <ul className='permissionsList'>
                                        {
                                            permissions.map((permission) => (
                                                <li  key={permission.id} className='switchPermission'>
                                                    <div>
                                                        <ToggleSwitch
                                                            idPartner=''
                                                            idClub=''
                                                            idToggle={permission.id}
                                                            nameToggle={permission.name}
                                                            typeToggle='permission'
                                                            isActive={false}
                                                            roles={userServices.getUser().roles}
                                                            isEnabled={true}
                                                        />
                                                    </div>
                                                    <span className='permissionName'>{permission.name}</span>
                                                </li>
                                            ))
                                        }
                                    </ul>
                                </fieldset>
                                <div className='actionBtns'>
                                    <Button 
                                        typeBtn='back'
                                        btnSvg='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
                                            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
                                            </svg>'
                                        btnTitle='Annuler'
                                        btnUrl='/partenaires'
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
