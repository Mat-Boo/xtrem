import React, { useEffect, useState } from 'react';
import Axios from '../../../_services/caller_service';
import PartnerCard from '../../../components/PartnerCard';
import Button from '../../../components/Button';
import Filters from '../../../components/Filters';
import { useDispatch, useSelector } from 'react-redux';
import Pagination from '../../../components/Pagination';
import { userServices } from '../../../_services/user_services';
import { paginationParams } from '../../../_services/paginationParams';
import { helpers } from '../../../_services/helpers';
import Loader from '../../../components/Loader';
import { updateFilter, updateLoader } from '../../../redux/redux';
import {Helmet} from "react-helmet";

export default function Partners() {
    
    const [partners, setPartners] = useState();
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
    
    const [loader, setLoader] = useState(true);
    const dispatchLoader = useDispatch();
    const stockLoaderInStore = (data) => {
        dispatchLoader(updateLoader(data))
    }

    //Pagination
    const [currentPage, setCurrentPage] = useState();
    const lastItemIndex = currentPage * paginationParams.partnersPerPage;
    const firstItemIndex = lastItemIndex - paginationParams.partnersPerPage;

    useEffect(() => {
        stockLoaderInStore(true);
        Axios.get('/api/partners')
        .then((response) => {
            setPartners(response.data);
            response.data.forEach((partner) => {
                if (partner.isActive) {
                    setLengthes(lengthes => ({...lengthes, actives: lengthes.actives + 1}));
                } else {
                    setLengthes(lengthes => ({...lengthes, inactives: lengthes.inactives + 1}));
                }
            })
            setLengthes(lengthes => ({...lengthes, all: response.data.length}));
            setLoader(false);
            stockLoaderInStore(false);
        })
        setCurrentPage(1);

        return () => {
            stockFilterInStore({search: '', state: 'all'});
        }

    }, [])    
  
    return (
        <div className='partners'>
            <Helmet>
                <title>Partenaires | Xtrem</title>
                <meta name="description" content="Xtrem, gestion des partenaires avec possibilité d'activer et de désactiver un partenaire, visualisé un partenaire et gérer ses clubs." />
            </Helmet>
            <div className='header'>
                <h1>Partenaires</h1>
                <Button
                    typeBtn='add'
                    btnSvg='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"/>
                        </svg>'
                    btnTitle='Ajouter'
                    btnUrl='/partenaires/ajouter'
                    isActive={true}
                />
            </div>
            {
                loader ? 
                    <Loader /> :
                    partners.length === 0 ?
                    <p className='messageNoPartner'>Il n'existe aucun partenaire.</p> :
                    <div className='filterAndPartners'>
                        <Filters type='partner' all={lengthes.all} actives={lengthes.actives} inactives={lengthes.inactives} displayStates={true} />
                        <div className='partnersListAndPagination'>
                            {
                                partners
                                .filter((partner) => (
                                    (
                                        filter.state === 'all' ?
                                        partner.isActive === true || partner.isActive === false :
                                        partner.isActive === filter.state
                                    )
                                    && 
                                    (
                                        partner.id.toString().includes(filter.search.toString()) || 
                                        helpers.replaceAccent(partner.name).toLowerCase().includes(helpers.replaceAccent(filter.search).toString().toLowerCase()) || 
                                        helpers.replaceAccent(partner.description).toLowerCase().includes(helpers.replaceAccent(filter.search).toString().toLowerCase())
                                    )
                                )).length === 0 ?
                                <p className='messageNoPartner'>Aucun partenaire ne correspond à votre recherche.</p> :
                                <ul className='partnersList'>
                                    {
                                        partners
                                        .filter((partner) => (
                                            (
                                                filter.state === 'all' ?
                                                partner.isActive === true || partner.isActive === false :
                                                partner.isActive === filter.state
                                            )
                                            && 
                                            (
                                                partner.id.toString().includes(filter.search.toString()) || 
                                                helpers.replaceAccent(partner.name).toLowerCase().includes(helpers.replaceAccent(filter.search).toString().toLowerCase()) || 
                                                helpers.replaceAccent(partner.description).toLowerCase().includes(helpers.replaceAccent(filter.search).toString().toLowerCase())
                                            )
                                            ))
                                            .map((partner) => (
                                                <PartnerCard 
                                                    key={partner.id}
                                                    id={partner.id}
                                                    logo={partner.logo}
                                                    name={partner.name}
                                                    description={partner.description}
                                                    isActive={partner.isActive}
                                                    roles={userServices.getUser().roles}
                                                    nbClubs={partner.clubs.length}
                                                />
                                            ))
                                            .slice(firstItemIndex, lastItemIndex)
                                    }
                                </ul>
                            }
                            {
                                partners
                                .filter((partner) => (
                                    (
                                        filter.state === 'all' ?
                                        partner.isActive === true || partner.isActive === false :
                                        partner.isActive === filter.state
                                    )
                                    && 
                                    (
                                        partner.id.toString().includes(filter.search.toString()) || 
                                        helpers.replaceAccent(partner.name).toLowerCase().includes(helpers.replaceAccent(filter.search).toString().toLowerCase()) || 
                                        helpers.replaceAccent(partner.description).toLowerCase().includes(helpers.replaceAccent(filter.search).toString().toLowerCase())
                                    )
                                )).length > paginationParams.partnersPerPage ?
                                <Pagination 
                                    totalItems={
                                        partners
                                        .filter((partner) => (
                                            (
                                                filter.state === 'all' ?
                                                partner.isActive === true || partner.isActive === false :
                                                partner.isActive === filter.state
                                            )
                                            && 
                                            (
                                                partner.id.toString().includes(filter.search.toString()) || 
                                                helpers.replaceAccent(partner.name).toLowerCase().includes(helpers.replaceAccent(filter.search).toString().toLowerCase()) || 
                                                helpers.replaceAccent(partner.description).toLowerCase().includes(helpers.replaceAccent(filter.search).toString().toLowerCase())
                                            )
                                            )).length
                                        }
                                    itemsPerPage={paginationParams.partnersPerPage}
                                    setCurrentPage={setCurrentPage}
                                    currentPage={currentPage}/> : null
                            }
                        </div>
                    </div>
            }
        </div>
    )
}