import React, { useEffect, useRef, useState } from 'react';
import Axios from '../../_services/caller_service';
import Filters from '../../components/Filters';
import { useDispatch, useSelector } from 'react-redux';
import ClubCard from '../../components/ClubCard';
import { userServices } from '../../_services/user_services';
import { paginationParams } from '../../_services/paginationParams';
import Pagination from '../../components/Pagination';
import ToggleSwitch from '../../components/ToggleSwitch';
import Loader from '../../components/Loader';
import {Helmet} from "react-helmet";
import { updateLoader } from '../../redux/redux';

export default function MyClubs() {
    
    const [user, setUser] = useState([]);
    
    const [lengthes, setLengthes] = useState();
    const filter = useSelector((state) => state.filter);

    const detailsInfosRef = useRef();
    const chevronDownPartnerDetails = useRef();
    const detailsBtnRef = useRef();
    const detailsRef = useRef();

    const [displayedParterDetails, setDisplayedPartnerDetails] = useState(false);

    const [loader, setLoader] = useState(true);
    const dispatchLoader = useDispatch();
    const stockLoaderInStore = (data) => {
        dispatchLoader(updateLoader(data))
    }
    
    //Pagination
    const [currentPage, setCurrentPage] = useState();
    const lastItemIndex = currentPage * paginationParams.clubsPerPage;
    const firstItemIndex = lastItemIndex - paginationParams.clubsPerPage;
    
    useEffect(() => {
        stockLoaderInStore(true);
        if (userServices.isConnected()) {
            Axios.get('/api/user-partner/')
            .then((response) => {
                setUser(response.data);
                setLengthes({
                    all: 0,
                    actives: 0,
                    inactives: 0
                })
                response.data.partner.clubs.forEach((club) => {
                    if (club.isActive) {
                        setLengthes(lengthes => ({...lengthes, actives: lengthes.actives + 1}));
                    } else {
                        setLengthes(lengthes => ({...lengthes, inactives: lengthes.inactives + 1}));
                    }
                })
                setLengthes(lengthes => ({...lengthes, all: response.data.partner.clubs.length}));
                setLoader(false);
                stockLoaderInStore(false);
            })
        }
        setCurrentPage(1);
    }, [filter])

    const displayPartnerDetails = () => {
        if (!displayedParterDetails) {
            setDisplayedPartnerDetails(true);
            detailsRef.current.style.maxWidth = '1720px';
            setTimeout(() => {
                detailsInfosRef.current.style.transition = 'max-height 1500ms ease-in';
                detailsInfosRef.current.style.maxHeight = '5000px';
                chevronDownPartnerDetails.current.style.transform = 'rotate(-180deg)';
                setTimeout(() => {
                    detailsInfosRef.current.style.maxHeight = (detailsInfosRef.current.clientHeight) * 2  + 'px';
                }, 1000);
            }, 400);
        } else {
            setDisplayedPartnerDetails(false);
            detailsInfosRef.current.style.transition = 'max-height 500ms ease-in';
            detailsInfosRef.current.style.maxHeight = 0;
            chevronDownPartnerDetails.current.style.transform = 'rotate(0)';
            setTimeout(() => {
                detailsRef.current.style.maxWidth = '115px';
            }, 400);

        }
    }

    return (
        <>
            {
                loader ? 
                    <Loader /> :
                    user.partner &&
                    <div className='myClubs'>
                        <Helmet>
                            <title>Mes clubs | Xtrem</title>
                            <meta name="description" content="Xtrem, visualisation des clubs du partenaire avec leurs permissions." />
                        </Helmet>
                        <div className='header'>
                            <h1>Mes clubs</h1>
                        </div>
                        <div className='partner'>
                            <div className='logoAndInfos'>
                                <img src={'/uploads/' + user.partner.logo} alt='partner-logo' className='logo'/>
                                <div className='partnerInfos'>
                                    <p className='id'>{user.partner.id}</p>
                                    <p className='name'>{user.partner.name}</p>
                                    <p className='description'>{user.partner.description}</p>
                                </div>
                            </div>
                            <div className='details' ref={detailsRef}>
                                <div className="detailsBtn" onClick={displayPartnerDetails} ref={detailsBtnRef}>
                                    <span>Détails</span>
                                    <svg ref={chevronDownPartnerDetails} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="chevronDownPartnerDetails" viewBox="0 0 16 16">
                                        <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
                                    </svg>
                                </div>
                                <div className="detailsInfos" ref={detailsInfosRef}>
                                    <div className='partnerContact'>
                                        <p className='name'>
                                            {user.firstname + ' ' + user.lastname}
                                        </p>
                                        <p className='phone'>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-telephone" viewBox="0 0 16 16">
                                                <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.678.678 0 0 0-.122-.58L3.654 1.328zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z"/>
                                            </svg>
                                            <a href={"tel:" + user.phone} className='telCom'>{user.phone}</a>
                                        </p>
                                        <p className='email'>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-envelope" viewBox="0 0 16 16">
                                                <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z"/>
                                            </svg>
                                            <a href={"mailto:" + user.email} className='emailCom'>{user.email}</a>
                                        </p>
                                    </div>
                                    <form>
                                        <fieldset id='permissionsFieldset'>
                                            <legend>Permissions Globales</legend>
                                            <ul className='permissionsList'>
                                                {
                                                    user.partner.partnerPermissions.map((partnerPermission) => (
                                                        <li  key={partnerPermission.Permission.id} className='switchPermission'>
                                                            <div>
                                                                <ToggleSwitch
                                                                    idPartner={user.partner.id}
                                                                    namePartner={user.partner.name}
                                                                    idToggle={partnerPermission.Permission.id}
                                                                    nameToggle={partnerPermission.Permission.name}
                                                                    typeToggle='permission'
                                                                    isActive={partnerPermission.isActive}
                                                                    roles={userServices.getUser().roles}
                                                                    isEnabled={user.partner.isActive}
                                                                />
                                                            </div>
                                                            <span className='permissionName'>{partnerPermission.Permission.name}</span>
                                                        </li>
                                                    ))
                                                }
                                            </ul>
                                        </fieldset>
                                    </form>
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
                                                            partnerState={user.partner.isActive}
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
