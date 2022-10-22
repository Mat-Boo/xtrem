import React from 'react';
import { useSelector } from 'react-redux';
import SportClipart from './SportClipart';

export default function Footer() {

    const loader = useSelector((state) => state.loader);

    return (
        <div className="sportClipartAndFooter">
            {
                !loader &&
                <SportClipart />
            }
            <div className='footer'>
                <span className='copyright'>© 2022 Xtrem | Créé par Mathieu Bouthors</span>
            </div>
        </div>
    )
}
