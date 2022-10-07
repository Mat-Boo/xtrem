import React, { useEffect, useState } from 'react';
import Axios from '../../_services/caller_service';
import Filters from '../../components/Filters';
import { useSelector } from 'react-redux';
import ClubCard from '../../components/ClubCard';
import { userServices } from '../../_services/user_services';
import { paginationParams } from '../../_services/paginationParams';
import Pagination from '../../components/Pagination';

export default function MyClubs() {

    const [user, setUser] = useState([]);

    const [lengthes, setLengthes] = useState();
    const filter = useSelector((state) => state.filter);

    //Pagination
    const [currentPage, setCurrentPage] = useState();
    const lastItemIndex = currentPage * paginationParams.clubsPerPage;
    const firstItemIndex = lastItemIndex - paginationParams.clubsPerPage;

    useEffect(() => {
        document.title = 'Mes Clubs | Xtrem';
        if (userServices.isConnected()) {
            Axios.get('/api/userPartner/' + userServices.getUser().username)
            .then((res) => {
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
        setCurrentPage(1);
    }, [filter])

    return (
        <>
            {
                user.partner &&
                <div className='myClubs'>
                    <div className='header'>
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
                            <p className='messageNoClub'>Aucun club ne vous est assigné ou il sont en cours de création.</p> :
                            <div className='clubsListAndPagination'>
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
                                    )).length === 0 ?
                                    <p className='messageNoClub'>Aucun club ne correspond à votre recherche.</p> :
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
                                                .slice(firstItemIndex, lastItemIndex)
                                        }
                                    </ul>
                                }
                            </div>
                    }
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
                        )).length > paginationParams.clubsPerPage ?
                        <Pagination 
                            totalItems={
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
                                )).length
                                }
                            itemsPerPage={paginationParams.clubsPerPage}
                            setCurrentPage={setCurrentPage}
                            currentPage={currentPage}/> : null
                    }
                </div>
            }
        </>
    )
}
