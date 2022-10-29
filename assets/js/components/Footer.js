import React from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import SportClipart from './SportClipart';

export default function Footer() {

    const loader = useSelector((state) => state.loader);

    return (
        <div className="sportClipartAndFooter">
            {
                !loader &&
                <SportClipart />
            }
            <footer className='footer'>
                <span className='copyright'>© 2022 Xtrem | Créé par Mathieu Bouthors | <NavLink to='/mentions-legales'>Mentions Légales</NavLink></span>
            </footer>
        </div>
    )
}
