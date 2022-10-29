import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Button from '../../../components/Button';
import ToggleSwitch from '../../../components/ToggleSwitch';
import slugify from 'react-slugify';
import Filters from '../../../components/Filters';
import { useDispatch, useSelector } from 'react-redux';
import ClubCard from '../../../components/ClubCard';
import { userServices } from '../../../_services/user_services';
import { paginationParams } from '../../../_services/paginationParams';
import Pagination from '../../../components/Pagination';
import { helpers } from '../../../_services/helpers';
import { updateAxiosAnswer, updateFilter, updateLoader } from '../../../redux/redux';
import Loader from '../../../components/Loader';
import {Helmet} from "react-helmet";
import { axiosCaller } from '../../../_services/axiosCaller';

export default function ManageClubs() {

    const [partner, setPartner] = useState([]);
    const id = useParams().idSlug.substring(0, useParams().idSlug.indexOf('-', 0));
    const [lengthes, setLengthes] = useState({
        all: 0,
        actives: 0,
        inactives: 0
    });
    const filter = useSelector((state) => state.filter);
    const dispatchFilter = useDispatch();
    const stockFilterInStore = (data) => {
        dispatchFilter(updateFilter(data))
    }

    // Gestion du loader, gif s'affichant pendant l'appel d'Axios avant le retour de sa réponse
    const [loader, setLoader] = useState(true);
    const dispatchLoader = useDispatch();
    const stockLoaderInStore = (data) => {
        dispatchLoader(updateLoader(data))
    }
    
    //Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const lastItemIndex = currentPage * paginationParams.clubsPerPage;
    const firstItemIndex = lastItemIndex - paginationParams.clubsPerPage;
    
    const axiosAnswer = useSelector((state) => state.axiosAnswer);
    const dispatchAxiosAnswer = useDispatch();
    const stockAxiosAnswerInStore = (data) => {
        dispatchAxiosAnswer(updateAxiosAnswer(data))
    }
    
    const alertMessage = useSelector((state) => state.alertMessage);
    
    useEffect(() => {
        stockLoaderInStore(true);
        axiosCaller.askCsrf()
        .then((response) => {
            axiosCaller.callAxios('/api/partner/' + id, 'GET', response.data)
            .then((response) => {
                setPartner(response.data);
                setLengthes({
                    all: 0,
                    actives: 0,
                    inactives: 0
                })
                response.data.clubs.forEach((club) => {
                    if (club.isActive) {
                        setLengthes(lengthes => ({...lengthes, actives: lengthes.actives + 1}));
                    } else {
                        setLengthes(lengthes => ({...lengthes, inactives: lengthes.inactives + 1}));
                    }
                })
                setLengthes(lengthes => ({...lengthes, all: response.data.clubs.length}));
                setLoader(false);
                stockLoaderInStore(false);
                if ((response.data.clubs.length / paginationParams.clubsPerPage) < currentPage) {
                    setCurrentPage(Math.ceil(response.data.clubs.length / paginationParams.clubsPerPage));
                } else {
                    setCurrentPage(currentPage);
                }
            })
            stockAxiosAnswerInStore('');
        })

        return () => {
            stockFilterInStore({search: '', state: 'all'});
        }
    }, [alertMessage])


    return (
        <>
            {
                loader ? 
                    <Loader /> :
                    partner.clubs &&
                    <div className='manageClubs'>
                        <Helmet>
                            <title>Gestion des clubs | Xtrem</title>
                            <meta name="description" content="Xtrem, gestion des clubs avec possibilité d'activer et de désactiver un club, modifier les informations d'un club, réinitialiser l'accès d'un manager, supprimer un club et gérer les permissions d'un club." />
                        </Helmet>
                        <div className='header'>
                            <Button 
                                typeBtn='back'
                                btnSvg='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-chevron-left" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
                                    </svg>'
                                btnTitle='Retour'
                                btnUrl={'/partenaires'}
                                isActive={true}
                            />
                            <h1>Gestion des clubs</h1>
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
                                        isActive={partner.isActive}
                                        roles={userServices.getUser().roles}
                                        isEnabled={true}
                                    />
                                    <Button
                                        typeBtn='details'
                                        btnSvg='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="detailsSvg" viewBox="0 0 16 16">
                                            <path d="M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z"/>
                                            <path d="M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5L9.5 0zm0 1v2A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z"/>
                                            </svg>'
                                        btnTitle='Détails'
                                        btnUrl={'/partenaires/' + partner.id + '-' + slugify(partner.name)}
                                        isActive={true}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className='filtersAndClubs' key={partner.isActive}>
                            <Filters key={partner.clubs.length} type='club' all={lengthes.all} actives={lengthes.actives} inactives={lengthes.inactives} displayStates={true} />
                            {
                                !partner.isActive &&
                                    <p className='messageActivatePartner'>Le partenaire doit être activé pour pouvoir gérer ses clubs.</p>
                            }
                            <div className='addBtnBox'>
                                <Button
                                    typeBtn='add'
                                    btnSvg='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"/>
                                        </svg>'
                                    btnTitle='Ajouter'
                                    btnUrl='ajouter'
                                    isActive={partner.isActive}
                                />
                            </div>
                            {
                                partner.clubs.length === 0 ?
                                    <p className='messageNoClub'>Ce partenaire ne possède aucun club.</p> :
                                    <div className='clubsListAndPagination'>
                                        {
                                            partner.clubs
                                            .filter((club) => (
                                                (
                                                    filter.state === 'all' ?
                                                    club.isActive === true || club.isActive === false :
                                                    club.isActive === filter.state
                                                )
                                                && 
                                                (
                                                    club.id.toString().includes(filter.search.toString()) || 
                                                    helpers.replaceAccent(club.name).toLowerCase().includes(helpers.replaceAccent(filter.search).toString().toLowerCase()) || 
                                                    helpers.replaceAccent(club.address).toLowerCase().includes(helpers.replaceAccent(filter.search).toString().toLowerCase()) ||
                                                    club.zipcode.includes(filter.search.toString()) ||
                                                    helpers.replaceAccent(club.city).toLowerCase().includes(helpers.replaceAccent(filter.search).toString().toLowerCase()) ||
                                                    helpers.replaceAccent(club.manager.firstname).toLowerCase().includes(helpers.replaceAccent(filter.search).toString().toLowerCase()) ||
                                                    helpers.replaceAccent(club.manager.lastname).toLowerCase().includes(helpers.replaceAccent(filter.search).toString().toLowerCase()) ||
                                                    club.manager.phone.toLowerCase().includes(filter.search.toString().toLowerCase()) ||
                                                    club.manager.email.toLowerCase().includes(filter.search.toString().toLowerCase())
                                                )
                                            )).length === 0 ?
                                            <p className='messageNoClub'>Aucun club ne correspond à votre recherche.</p> :
                                            <ul className='clubsList'
                                                style={{opacity: !partner.isActive  ? 0.5 : ''}}>
                                                {
                                                    partner.clubs
                                                        .filter((club) => (
                                                            (
                                                                filter.state === 'all' ?
                                                                club.isActive === true || club.isActive === false :
                                                                club.isActive === filter.state
                                                            )
                                                            && 
                                                            (
                                                                club.id.toString().includes(filter.search.toString()) || 
                                                                helpers.replaceAccent(club.name).toLowerCase().includes(helpers.replaceAccent(filter.search).toString().toLowerCase()) || 
                                                                helpers.replaceAccent(club.address).toLowerCase().includes(helpers.replaceAccent(filter.search).toString().toLowerCase()) ||
                                                                club.zipcode.includes(filter.search.toString()) ||
                                                                helpers.replaceAccent(club.city).toLowerCase().includes(helpers.replaceAccent(filter.search).toString().toLowerCase()) ||
                                                                helpers.replaceAccent(club.manager.firstname).toLowerCase().includes(helpers.replaceAccent(filter.search).toString().toLowerCase()) ||
                                                                helpers.replaceAccent(club.manager.lastname).toLowerCase().includes(helpers.replaceAccent(filter.search).toString().toLowerCase()) ||
                                                                club.manager.phone.toLowerCase().includes(filter.search.toString().toLowerCase()) ||
                                                                club.manager.email.toLowerCase().includes(filter.search.toString().toLowerCase())
                                                            )
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
                                                                zipcode={club.zipcode}
                                                                city={club.city}
                                                                idManager={club.manager.id}
                                                                firstname={club.manager.firstname}
                                                                lastname={club.manager.lastname}
                                                                phone={club.manager.phone}
                                                                email={club.manager.email}
                                                                permissions={club.clubPermissions}
                                                                roles={userServices.getUser().roles}
                                                                partnerState={partner.isActive}
                                                            />
                                                        ))
                                                        .slice(firstItemIndex, lastItemIndex)
                                                }
                                            </ul>
                                        }
                                        {
                                            partner.clubs
                                            .filter((club) => (
                                                (
                                                    filter.state === 'all' ?
                                                    club.isActive === true || club.isActive === false :
                                                    club.isActive === filter.state
                                                )
                                                && 
                                                (
                                                    club.id.toString().includes(filter.search.toString()) || 
                                                    helpers.replaceAccent(club.name).toLowerCase().includes(helpers.replaceAccent(filter.search).toString().toLowerCase()) || 
                                                    helpers.replaceAccent(club.address).toLowerCase().includes(helpers.replaceAccent(filter.search).toString().toLowerCase()) ||
                                                    club.zipcode.includes(filter.search.toString()) ||
                                                    helpers.replaceAccent(club.city).toLowerCase().includes(helpers.replaceAccent(filter.search).toString().toLowerCase()) ||
                                                    helpers.replaceAccent(club.manager.firstname).toLowerCase().includes(helpers.replaceAccent(filter.search).toString().toLowerCase()) ||
                                                    helpers.replaceAccent(club.manager.lastname).toLowerCase().includes(helpers.replaceAccent(filter.search).toString().toLowerCase()) ||
                                                    club.manager.phone.toLowerCase().includes(filter.search.toString().toLowerCase()) ||
                                                    club.manager.email.toLowerCase().includes(filter.search.toString().toLowerCase())
                                                )
                                            )).length > paginationParams.clubsPerPage ?
                                            <Pagination
                                                totalItems={
                                                    partner.clubs
                                                        .filter((club) => (
                                                            (
                                                                filter.state === 'all' ?
                                                                club.isActive === true || club.isActive === false :
                                                                club.isActive === filter.state
                                                            )
                                                            && 
                                                            (
                                                                club.id.toString().includes(filter.search.toString()) || 
                                                                helpers.replaceAccent(club.name).toLowerCase().includes(helpers.replaceAccent(filter.search).toString().toLowerCase()) || 
                                                                helpers.replaceAccent(club.address).toLowerCase().includes(helpers.replaceAccent(filter.search).toString().toLowerCase()) ||
                                                                club.zipcode.includes(filter.search.toString()) ||
                                                                helpers.replaceAccent(club.city).toLowerCase().includes(helpers.replaceAccent(filter.search).toString().toLowerCase()) ||
                                                                helpers.replaceAccent(club.manager.firstname).toLowerCase().includes(helpers.replaceAccent(filter.search).toString().toLowerCase()) ||
                                                                helpers.replaceAccent(club.manager.lastname).toLowerCase().includes(helpers.replaceAccent(filter.search).toString().toLowerCase()) ||
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
                        </div>
                    </div>
            }
        </>
    )
}
