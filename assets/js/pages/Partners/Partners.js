import React, { useEffect, useMemo, useState } from 'react';
import Axios from '../../_services/caller_service';
import PartnerCard from '../../components/PartnerCard';
import Button from '../../components/Button';
import Filters from '../../components/Filters';
import { useSelector } from 'react-redux';
import Pagination from '../../components/Pagination';

export default function Partners() {

    const alertMessage = useSelector((state) => state.alertMessage);
    const [partners, setPartners] = useState([]);
    const [lengthes, setLengthes] = useState();
    const auth = useSelector((state) => state.auth);
    const filter = useSelector((state) => state.filter);

    const [filteredPartners, setFilteredPartners] = useState();
    
    useEffect(() => {
        Axios.get('/api/partners')
        .then((res) => {
            setPartners(res.data);
            setFilteredPartners(res.data);
            setLengthes({
                all: 0,
                actives: 0,
                inactives: 0
            })
            res.data.forEach((partner) => {
                if (partner.isActive) {
                    setLengthes(lengthes => ({...lengthes, actives: lengthes.actives + 1}));
                } else {
                    setLengthes(lengthes => ({...lengthes, inactives: lengthes.inactives + 1}));
                }
            })
            setLengthes(lengthes => ({...lengthes, all: res.data.length}));
        })
        .catch(error => {
            console.log(error);
        });
    }, [alertMessage])

    //Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(6);
    const lastItemIndex = currentPage * itemsPerPage;
    const firstItemIndex = lastItemIndex - itemsPerPage;
    
/*     const filterPartners = () => {
        setFilteredPartners(partners.filter((partner) => (
            (filter.state === 'all' ?
            partner.isActive === true || partner.isActive === false :
            partner.isActive === filter.state)
            && (partner.id.toString().includes(filter.search.toString()) || 
            partner.name.toLowerCase().includes(filter.search.toString().toLowerCase()) || 
            partner.description.toLowerCase().includes(filter.search.toString().toLowerCase()))
            )));
    } */

    const filterPartners = useMemo(() => {
        partners.filter((partner) => (
            (filter.state === 'all' ?
            partner.isActive === true || partner.isActive === false :
            partner.isActive === filter.state)
            && (partner.id.toString().includes(filter.search.toString()) || 
            partner.name.toLowerCase().includes(filter.search.toString().toLowerCase()) || 
            partner.description.toLowerCase().includes(filter.search.toString().toLowerCase()))
            ));
    })
        
    const currentItems = partners.slice(firstItemIndex, lastItemIndex);
    /* console.log(filterPartners); */

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
                                currentItems
                                    /* .filter((partner) => (
                                        (filter.state === 'all' ?
                                            partner.isActive === true || partner.isActive === false :
                                            partner.isActive === filter.state)
                                        && (partner.id.toString().includes(filter.search.toString()) || 
                                        partner.name.toLowerCase().includes(filter.search.toString().toLowerCase()) || 
                                        partner.description.toLowerCase().includes(filter.search.toString().toLowerCase()))
                                    )) */
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
                        <Pagination totalItems={partners.length} itemsPerPage={itemsPerPage} setCurrentPage={setCurrentPage} currentPage={currentPage}/>
                    </div>
            }
        </>
    )
}