import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Button from '../../components/Button';
import ToggleSwitch from '../../components/ToggleSwitch';
import axios from 'axios';
import slugify from 'react-slugify';
import Filters from '../../components/Filters';
import { useSelector } from 'react-redux';
import ClubCard from '../../components/ClubCard';

export default function ManageClubs() {

    const [partner, setPartner] = useState([]);
    const id = useParams().idSlug.substring(0, useParams().idSlug.indexOf('-', 0));
    const [lengthes, setLengthes] = useState({
        all: 0,
        actives: 0,
        inactives: 0
    });
    const filter = useSelector((state) => state.filter);

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/partner/' + id)
        .then((res) => {
            setPartner(res.data);
            res.data.clubs.forEach((club) => {
                if (club.isActive) {
                    setLengthes(lengthes => ({...lengthes, actives: lengthes.actives + 1}));
                } else {
                    setLengthes(lengthes => ({...lengthes, inactives: lengthes.inactives + 1}));
                }
            })
            setLengthes(lengthes => ({...lengthes, all: res.data.clubs.length}));
        })
    }, [])

    return (
        <>
            {
                partner.clubs &&
                <div className='manageClubs'>
                    <div className='header'>
                        <Button 
                            type='back'
                            btnSvg='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-chevron-left" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
                                </svg>'
                            btnTitle='Retour'
                            btnUrl={-1}
                        />
                    </div>
                    <div className='partner'>
                        <div className='logoAndInfos'>
                            <img src={'/uploads/' + partner.logo} alt='partner-logo' className='logo'/>
                            <div className='partnerInfos'>
                                <div>
                                    <p className='id'>{partner.id}</p>
                                    <p className='name'>{partner.name}</p>
                                </div>
                                <ToggleSwitch
                                    idPartner={partner.id}
                                    idClub=''
                                    idToggle={partner.id}
                                    nameToggle={partner.name}
                                    typeToggle='partner'
                                    isActive={partner.isActive}/>
                                <Button
                                    typeBtn='details'
                                    btnSvg='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="detailsSvg" viewBox="0 0 16 16">
                                        <path d="M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z"/>
                                        <path d="M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5L9.5 0zm0 1v2A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z"/>
                                        </svg>'
                                    btnTitle='Détails'
                                    btnUrl={'/partenaires/' + partner.id + '-' + slugify(partner.name)}
                                />
                            </div>
                        </div>
                    </div>
                    <Filters all={lengthes.all} actives={lengthes.actives} inactives={lengthes.inactives} displayStates={true} />
                    <div className='addBtnBox'>
                        <Button
                            typeBtn='add'
                            btnSvg='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"/>
                                </svg>'
                            btnTitle='Ajouter'
                            btnUrl='ajouter'
                        />
                    </div>
                    {
                        partner.clubs.length === 0 ?
                            <p className='messageNoClub'>Ce partenaire ne possède aucun club.</p> :
                            <ul className='clubsList'>
                                {
                                    partner.clubs
                                        .filter((club) => (
                                            (filter.state === 'all' ?
                                                club.isActive === true || club.isActive === false :
                                                club.isActive === filter.state)
                                            && (club.id.toString().includes(filter.search.toString()) || 
                                            club.name.toLowerCase().includes(filter.search.toString().toLowerCase()) || 
                                            club.address.toLowerCase().includes(filter.search.toString().toLowerCase()))
                                        ))
                                        .map((club) => (
                                            <ClubCard
                                                key={club.id}
                                                partner={partner}
                                                id={club.id}
                                                name={club.name}
                                                logo={club.picture}
                                                isActive={club.isActive}
                                                address={club.address}
                                                zipcode={club.zip_code}
                                                city={club.city}
                                                firstname={club.manager.firstname}
                                                lastname={club.manager.lastname}
                                                phone={club.manager.phone}
                                                email={club.manager.email}
                                                permissions={club.clubPermissions}
                                            />
                                        ))
                                }
                            </ul>
                    }
                </div>
            }
        </>
    )
}
