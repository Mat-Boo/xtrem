import React, { useState } from 'react';
import Button from '../../components/Button';
import axios from 'axios';

export default function AddPartner() {

    // Add name of file under the input file when file is uploading
    const [filename, setFilename] = useState();
    const renameInputFile = (e) => {
        setFilename(e.target.value.split( '\\' ).pop());
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
        axios.post('http://127.0.0.1:8000/api/partner/create', {formValues})
        .then(response => {
            console.log(response);
        })
        .catch(error => {
            console.log(error);
        });
    }

    return (
        <div className='addPartner'>
            <div className='header'>
                <h1>Nouveau partenaire</h1>
            </div>
            <form onSubmit={(e) => validForm(e)}>
                <div id='idNameLogo'>
                    <div id='idName'>
                        <div className='formItem'>
                            <label htmlFor="id">Id</label>
                            <input type="text" id='id' name='id' />
                        </div>
                        <div className='formItem'>
                            <label htmlFor="name">Nom</label>
                            <input type="text" id='name' name='name' />
                        </div>
                    </div>
                    <div>
                        <div className='formItem logo'>
                            <input type="file" id='logo' name='logo' onChange={(e) => renameInputFile(e)}/>
                            <label htmlFor="logo">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-upload" viewBox="0 0 16 16">
                                    <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                                    <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"/>
                                </svg>
                                Ajouter un logo
                            </label>
                        </div>
                        <p>{filename ? filename : ''}</p>
                    </div>
                </div>
                <div className='formItem description'>
                    <label htmlFor="description">Description</label>
                    <textarea name="description" id="description" cols="30" rows="5"></textarea>
                </div>
                <fieldset>
                    <legend>Contact</legend>
                    <div className='contactGroup'>
                        <div className='formItem'>
                            <label htmlFor="firstname">Prénom</label>
                            <input type="text" id='firstname' name='firstname' />
                        </div>
                        <div className='formItem'>
                            <label htmlFor="lastname">Nom</label>
                            <input type="text" id='lastname' name='lastname' />
                        </div>
                    </div>
                    <div className='contactGroup'>
                        <div className='formItem'>
                            <label htmlFor="phone">Téléphone</label>
                            <input type="text" id='phone' name='phone' />
                        </div>
                        <div className='formItem'>
                            <label htmlFor="email">Email</label>
                            <input type="email" id='email' name='email' />
                        </div>
                    </div>
                    <div className='contactGroup'>
                        <div className='formItem'>
                            <label htmlFor="password">Mot de passe</label>
                            <input type="password" id='password' name='password' />
                        </div>
                        <div className='formItem'>
                            <label htmlFor="passwordConfirm">Confirmer le mot passe</label>
                            <input type="password" id='passwordConfirm' name='passwordConfirm' />
                        </div>
                    </div>
                </fieldset>
                <div className='actionBtns'>
                    <Button 
                        type='cancel'
                        btnSvg='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
                            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
                            </svg>'
                        btnTitle='Annuler'
                        btnUrl='/partenaires'
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
