import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import slugify from 'react-slugify';
import PartnerCard from '../components/partnerCard';

export default function Partners() {

    const [partners, setPartners] = useState([]);

    useEffect(() => {
      axios.get(`http://127.0.0.1:8000/api/partners`)
      .then((res) => {
        setPartners(res.data);
      })
    
    }, [])

    return (
        <div className='partners'>
            <ul className='partnersList'>
                {
                    partners.map((partner) => (
                        <PartnerCard 
                            key={partner.id}
                            id={partner.id}
                            logo={partner.logo}
                            name={partner.name}
                            description={partner.description}
                        />
                    ))
                }
            </ul>
        </div>
    )
}
