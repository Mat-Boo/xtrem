import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PartnerCard from '../../components/PartnerCard';
import Button from '../../components/Button';
import AlertMessage from '../../components/AlertMessage';
import { useDispatch, useSelector } from 'react-redux';
import { updateMessage } from '../../redux/redux';

export default function Partners() {

    const [partners, setPartners] = useState([]);
    const message = useSelector((state) => state.message);
    const dispatchMessage = useDispatch();
    const stockInStore = (data) => {
        dispatchMessage(updateMessage(data))
    }

    useEffect(() => {
      axios.get('http://127.0.0.1:8000/api/partners')
      .then((res) => {
        setPartners(res.data);
      })
    
    }, [message])

    if (message) {
        scroll(0,0);
        setTimeout(() => {
            stockInStore(null);
        }, 4000);
    }

    return (
        <div className='partners'>
            <div className='header'>
                <h1>Partenaires</h1>
                <Button
                    type='add'
                    btnSvg='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"/>
                        </svg>'
                    btnTitle='Ajouter'
                    btnUrl='/partenaires/ajouter'
                />
            </div>
            {
                message && 
                    <AlertMessage type={message.type} message={message.content}/>
            }
            <ul className='partnersList'>
                {
                    partners.map((partner) => (
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
    )
}