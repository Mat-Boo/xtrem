import React from 'react';
import SportClipart from './SportClipart';

export default function Footer() {
    return (
        <div className="sportClipartAndFooter">
            <SportClipart />
            <div className='footer'>
                <span className='copyright'>© 2022 Xtrem | Créé par Mathieu Bouthors</span>
            </div>
        </div>
    )
}
