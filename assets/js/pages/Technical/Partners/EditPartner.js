import React, { useState, useEffect, useRef } from 'react';
import Button from '../../../components/Button';
import Axios from '../../../_services/caller_service';
import { useDispatch } from 'react-redux'
import { updateAlertMessage } from '../../../redux/redux';
import { useNavigate, useParams } from 'react-router-dom';
import { checkToken } from '../../../_services/checkToken';

export default function EditPartner() {
    
    const toggleSwitchRef = useRef();
    // Fonction permettant de cliquer sur le nom associé au toggle de la permission et ainsi l'activer ou le désactiver
    /* const handleClickPermissionName = () => {
        
        toggleSwitchRef.current.firstChild.click();
    } */
    const [partner, setPartner] = useState([]);
    const [displayLogo, setDisplayLogo] = useState(true);
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    
    const dispatchAlertMessage = useDispatch();
    const stockAlertMessageInStore = (data) => {
        dispatchAlertMessage(updateAlertMessage(data))
    }
    
    const id = useParams().idSlug.substring(0, useParams().idSlug.indexOf('-', 0));
    
    const [logoFile, setLogoFile] = useState();
    
    useEffect(() => {
        if (checkToken.expired()) {
            navigate('/');
        }
        document.title = 'Modification Partenaire | Xtrem';
        Axios.get('/api/partner/' + id)
        .then((res) => {
            setPartner(res.data);
        })
    }, [])

    const handleLogoFile = (e) => {
        setLogoFile(e.target.files[0])
    }

    const handleChange = (e) => {
        if (e.target.name === 'name' || e.target.name === 'description') {
            setPartner({
                ...partner, 
                [e.target.name]: e.target.value
            });
        } else if (e.target.name === 'firstname' || e.target.name === 'lastname' || e.target.name === 'phone' || e.target.name === 'email') {
            setPartner({
                ...partner, 
                ['contact']: {...partner.contact, [e.target.name]: e.target.value}
            });
        }
    }

    const changeLogo = () => {
        setDisplayLogo(false);
    }

    //Validate Form and send to api
    const validForm = (e) => {
        e.preventDefault();
        const formData = new FormData();
        for (let item of e.target) {
            if (item.name === 'logo' && logoFile) {
                formData.append('logoFile', logoFile);
                formData.append('logoFileName', logoFile.name);
            } else if (item.id !== '') {
                formData.append(item.id, item.value);
            }
        }
        if (displayLogo) {
            formData.append('displayedLogo', displayLogo)
        }
        Axios.post('/api/partner/' + id + '/edit', formData, {
            'content-type': 'multipart/form-data',
          })
          .then(response => {
            stockAlertMessageInStore({type: 'success', content: 'Le partenaire <b>' + response.data.name + '</b> a été modifié avec succès.'})
            navigate('/partenaires/' + partner.id + '-' + partner.name);
        })
        .catch(error => {
            stockAlertMessageInStore({type: 'error', content: 'La modification du partenaire n\'a pu aboutir, veuillez corriger les erreurs.'})
            setErrors(error.response.data);
        });
    }

    return (
        <>
            {
                partner.contact &&
                    <div className='editPartner'>
                        <div className='header'>
                            <h1>Edition du partenaire {partner.id}</h1>
                        </div>
                        <form noValidate onSubmit={(e) => validForm(e)}>
                            <div id='nameLogo'>
                                <div className='formItem'>
                                    <label htmlFor="name">Nom</label>
                                    <input type="text" id='name' name='name' value={partner.name} onChange={handleChange} style={{border: errors && errors.name !== undefined ? '1px solid #ECACAC' : ''}}/>
                                    {
                                        errors && errors.name !== undefined ?
                                        <p className='errorItem'>{errors.name}</p> :
                                        ''
                                    }
                                </div>
                                {
                                    displayLogo && 
                                        <div className='displayedLogoBox'>
                                            <img src={'/uploads/' + partner.logo} alt='partner-logo' className='displayedLogo'/>
                                            <svg onClick={changeLogo} xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="changeLogo" viewBox="0 0 16 16">
                                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
                                            </svg>
                                        </div>
                                }
                                {
                                    !displayLogo &&
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
                                }
                            </div>
                            <div className='formItem description'>
                                <label htmlFor="description">Description</label>
                                <textarea name="description" id="description" cols="30" rows="5" value={partner.description} onChange={handleChange} style={{border: errors && errors.description !== undefined ? '1px solid #ECACAC' : ''}}></textarea>
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
                                        <input type="text" id='firstname' name='firstname' value={partner.contact.firstname} onChange={handleChange} style={{border: errors && errors.firstname !== undefined ? '1px solid #ECACAC' : ''}}/>
                                    {
                                        errors && errors.firstname !== undefined ?
                                        <p className='errorItem'>{errors.firstname}</p> :
                                        ''
                                    }
                                    </div>
                                    <div className='formItem'>
                                        <label htmlFor="lastname">Nom</label>
                                        <input type="text" id='lastname' name='lastname' value={partner.contact.lastname} onChange={handleChange} style={{border: errors && errors.lastname !== undefined ? '1px solid #ECACAC' : ''}}/>
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
                                        <input type="tel" id='phone' name='phone' value={partner.contact.phone} onChange={handleChange} style={{border: errors && errors.phone !== undefined ? '1px solid #ECACAC' : ''}}/>
                                    {
                                        errors && errors.phone !== undefined ?
                                        <p className='errorItem'>{errors.phone}</p> :
                                        ''
                                    }
                                    </div>
                                    <div className='formItem'>
                                        <label htmlFor="email">Email</label>
                                        <input type="email" id='email' name='email' title="" value={partner.contact.email} onChange={handleChange} style={{border: errors && errors.email !== undefined ? '1px solid #ECACAC' : ''}}/>
                                    {
                                        errors && errors.email !== undefined ?
                                        <p className='errorItem'>{errors.email}</p> :
                                        ''
                                    }
                                    </div>
                                </div>
                            </fieldset>
                            <div className='actionBtns'>
                                <Button 
                                    typeBtn='back'
                                    btnSvg='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
                                        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
                                        </svg>'
                                    btnTitle='Annuler'
                                    btnUrl={-1}
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
