import React, { useEffect, useState } from 'react';
import Button from '../../components/Button';
import Axios from '../../_services/caller_service';
import Filters from '../../components/Filters';
import { useSelector } from 'react-redux';
import ClubCard from '../../components/ClubCard';
import { userServices } from '../../_services/user_services';

export default function MyClubs() {

    const alertMessage = useSelector((state) => state.alertMessage);
    const [user, setUser] = useState([]);

    const [lengthes, setLengthes] = useState();
    const filter = useSelector((state) => state.filter);

    useEffect(() => {
        if (userServices.isConnected()) {
            Axios.get('/api/userPartner/' + userServices.getUser().username)
            .then((res) => {
                console.log(res)
                setUser(res.data);
                setLengthes({
                    all: 0,
                    actives: 0,
                    inactives: 0
                })
                res.data.partner.clubs.forEach((club) => {
                    if (club.isActive) {
                        setLengthes(lengthes => ({...lengthes, actives: lengthes.actives + 1}));
                    } else {
                        setLengthes(lengthes => ({...lengthes, inactives: lengthes.inactives + 1}));
                    }
                })
                setLengthes(lengthes => ({...lengthes, all: res.data.partner.clubs.length}));
            })
        }
    }, [alertMessage])

    return (
        <>
            {
                user.partner &&
                <div className='myClubs'>
                    <div className='header'>
                        <Button 
                            typeBtn='back'
                            btnSvg='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-chevron-left" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
                                </svg>'
                            btnTitle='Retour'
                            btnUrl={-1}
                        />
                        <h1>Mes clubs</h1>
                    </div>
                    <div className='partner'>
                        <img src={'/uploads/' + user.partner.logo} alt='partner-logo' className='logo'/>
                        <div className='partnerInfos'>
                            <div>
                                <p className='id'>{user.partner.id}</p>
                                <p className='name'>{user.partner.name}</p>
                                <p className='description'>{user.partner.description}</p>
                            </div>
                        </div>
                    </div>
                    <Filters all={lengthes.all} actives={lengthes.actives} inactives={lengthes.inactives} displayStates={true} />
                    {
                        user.partner.clubs.length === 0 ?
                            <p className='messageNoClub'>Vous ne possédez aucun club.</p> :
                            <ul className='clubsList'>
                                {
                                    user.partner.clubs
                                        .filter((club) => (
                                            (
                                                filter.state === 'all' ?
                                                club.isActive === true || club.isActive === false :
                                                club.isActive === filter.state
                                            )
                                            && 
                                            (
                                                club.id.toString().includes(filter.search.toString()) || 
                                                club.name.toLowerCase().includes(filter.search.toString().toLowerCase()) || 
                                                club.address.toLowerCase().includes(filter.search.toString().toLowerCase()) ||
                                                club.zipcode.includes(filter.search.toString()) ||
                                                club.city.toLowerCase().includes(filter.search.toString().toLowerCase()) ||
                                                club.manager.firstname.toLowerCase().includes(filter.search.toString().toLowerCase()) ||
                                                club.manager.lastname.toLowerCase().includes(filter.search.toString().toLowerCase()) ||
                                                club.manager.phone.toLowerCase().includes(filter.search.toString().toLowerCase()) ||
                                                club.manager.email.toLowerCase().includes(filter.search.toString().toLowerCase())
                                            )
                                        ))
                                        .map((club) => (
                                            <ClubCard
                                                key={club.id}
                                                partner={user.partner}
                                                id={club.id}
                                                name={club.name}
                                                logo={club.picture}
                                                isActive={club.isActive}
                                                address={club.address}
                                                zipcode={club.zipcode}
                                                city={club.city}
                                                firstname={club.manager.firstname}
                                                lastname={club.manager.lastname}
                                                phone={club.manager.phone}
                                                email={club.manager.email}
                                                permissions={club.clubPermissions}
                                                roles={userServices.getUser().roles}
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
