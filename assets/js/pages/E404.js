import React, { useEffect } from 'react';
import Button from '../components/Button';
import logo from '../../img/logo_horizontal.png';
import { checkToken } from '../_services/checkToken';
import { useNavigate } from 'react-router-dom';

export default function E404() {

    const navigate = useNavigate();

    useEffect(() => {
        if (checkToken.expired()) {
            navigate('/');
        }
        document.title = 'Page introuvable | Xtrem';
    })

    return (
        <div className='e404'>
            <div className='header'>
                <h1>Page introuvable</h1>
            </div>
            <img src={logo} alt="logo" className='logo'/>
            <p className='messageContent'>Cette page n'existe pas !</p>
            <Button
                typeBtn='back'
                btnSvg='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-chevron-left" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
                    </svg>'
                btnTitle="Retour à l'accueil"
                btnUrl={'/'}
                isActive={true}
            />
        </div>
    )
}
