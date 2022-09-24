import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PartnerCard from '../../components/PartnerCard';
import Button from '../../components/Button';
import Filters from '../../components/Filters';
import { useSelector } from 'react-redux';

export default function Partners() {

    const [partners, setPartners] = useState([]);

    const [lengthes, setLengthes] = useState({
        all: 0,
        actives: 0,
        inactives: 0
    });

    const filter = useSelector((state) => state.filter);
    
    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/partners')
        .then((res) => {
            setPartners(res.data);
            setLengthes({all: 0, actives: 0, inactives: 0});
            res.data.forEach((partner) => {
                if (partner.isActive) {
                    setLengthes(lengthes => ({...lengthes, actives: lengthes.actives + 1}));
                } else {
                    setLengthes(lengthes => ({...lengthes, inactives: lengthes.inactives + 1}));
                }
            })
            setLengthes(lengthes => ({...lengthes, all: res.data.length}));
        })
    }, [])

    return (
        <>
            {
                partners[0] &&
                    <div className='partners'>
                        <div className='header'>
                            <h1>Partenaires</h1>
                            <Button
                                typeBtn='add'
                                btnSvg='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"/>
                                    </svg>'
                                btnTitle='Ajouter'
                                btnUrl='/partenaires/ajouter'
                            />
                        </div>
                        <Filters all={lengthes.all} actives={lengthes.actives} inactives={lengthes.inactives} displayStates={true} />
                        <ul className='partnersList'>
                            {
                                partners
                                    .filter((partner) => (
                                        (filter.state === 'all' ?
                                            partner.isActive === true || partner.isActive === false :
                                            partner.isActive === filter.state)
                                        && (partner.id.toString().includes(filter.search.toString()) || 
                                        partner.name.toLowerCase().includes(filter.search.toString().toLowerCase()) || 
                                        partner.description.toLowerCase().includes(filter.search.toString().toLowerCase()))
                                    ))
                                    .map((partner) => (
                                        <PartnerCard 
                                            key={partner.id}
                                            id={partner.id}
                                            logo={partner.logo}
                                            name={partner.name}
                                            description={partner.description}
                                            isActive={partner.isActive}
                                        />
                                    ))
                            }
                        </ul>
                    </div>
            }
        </>
    )
}