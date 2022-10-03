import React, { useEffect, useState } from 'react';
import Button from '../../components/Button';
import Axios from '../../_services/caller_service';
import { useSelector } from 'react-redux';
import ClubCard from '../../components/ClubCard';
import { userServices } from '../../_services/user_services';

export default function MyClub() {

    const alertMessage = useSelector((state) => state.alertMessage);
    const [user, setUser] = useState([]);

    const [lengthes, setLengthes] = useState();
    const filter = useSelector((state) => state.filter);

    useEffect(() => {
        if (userServices.isConnected()) {
            Axios.get('/api/userClub/' + userServices.getUser().username)
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

    console.log(user)

    return (
        <>
            {
                user.club &&
                <div className='myClub'>
                    <div className='header'>
                        <Button 
                            typeBtn='back'
                            btnSvg='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-chevron-left" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
                                </svg>'
                            btnTitle='Retour'
                            btnUrl={-1}
                        />
                        <h1>Mon club</h1>
                    </div>
                    <ClubCard
                        key={user.club.id}
                        partner={user.club.partner}
                        id={user.club.id}
                        name={user.club.name}
                        logo={user.club.picture}
                        isActive={user.club.isActive}
                        address={user.club.address}
                        zipcode={user.club.zipcode}
                        city={user.club.city}
                        firstname={user.firstname}
                        lastname={user.lastname}
                        phone={user.phone}
                        email={user.email}
                        permissions={user.club.clubPermissions}
                        roles={userServices.getUser().roles}
                    />
                    <form>
                        <fieldset className='partner'>
                            <legend>Mon partenaire</legend>
                            <div className='logoAndInfos'>
                                <img src={'/uploads/' + user.club.partner.logo} alt='partner-logo' className='logo'/>
                                <div className='partnerInfos'>
                                    <div>
                                        <p className='id'>{user.club.partner.id}</p>
                                        <p className='name'>{user.club.partner.name}</p>
                                        <p className='description'>{user.club.partner.description}</p>
                                    </div>
                                </div>
                            </div>
                            <hr />
                            <div className='partnerContact'>
                                <p className='name'>
                                    {user.club.partner.contact.firstname + ' ' + user.club.partner.contact.lastname}
                                </p>
                                <p className='phone'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-telephone" viewBox="0 0 16 16">
                                        <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.678.678 0 0 0-.122-.58L3.654 1.328zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z"/>
                                    </svg>
                                    <a href={"tel:" + user.club.partner.contact.phone} className='telCom'>{user.club.partner.contact.phone}</a>
                                </p>
                                <p className='email'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-envelope" viewBox="0 0 16 16">
                                        <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z"/>
                                    </svg>
                                    <a href={"mailto:" + user.club.partner.contact.email} className='emailCom'>{user.club.partner.contact.email}</a>
                                </p>
                            </div>
                        </fieldset>
                    </form>
                </div>
            }
        </>
    )
}