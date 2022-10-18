import React, { useState, useEffect } from 'react';
import Axios from '../../../_services/caller_service';
import PermissionCard from '../../../components/PermissionCard';
import Button from '../../../components/Button';
import { useDispatch, useSelector } from 'react-redux';
import Filters from '../../../components/Filters';
import Pagination from '../../../components/Pagination';
import { paginationParams } from '../../../_services/paginationParams';
import { helpers } from '../../../_services/helpers';
import Loader from '../../../components/Loader';
import { updateFilter } from '../../../redux/redux';

export default function Permissions() {

    const alertMessage = useSelector((state) => state.alertMessage);
    const [permissions, setPermissions] = useState([]);
    const filter = useSelector((state) => state.filter);
    const dispatchFilter = useDispatch();
    const stockFilterInStore = (data) => {
        dispatchFilter(updateFilter(data))
    }

    const [loader, setLoader] = useState(true);

    //Pagination
    const [currentPage, setCurrentPage] = useState();
    const lastItemIndex = currentPage * paginationParams.permissionsPerPage;
    const firstItemIndex = lastItemIndex - paginationParams.permissionsPerPage;

    useEffect(() => {
        Axios.get('/api/permissions')
        .then((response) => {
            setPermissions(response.data);
            setLoader(false);
        })
        setCurrentPage(1);
        document.title = 'Permissions | Xtrem';
        
        return () => {
            stockFilterInStore({search: '', state: 'all'});
        }

    }, [alertMessage])

    
    return (
        <div className='permissions'>
            <div className='header'>
                <h1>Permissions</h1>
                <Button
                    typeBtn='add'
                    btnSvg='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"/>
                        </svg>'
                    btnTitle='Ajouter'
                    btnUrl='/permissions/ajouter'
                    isActive={true}
                />
            </div>
            {
                loader ? 
                    <Loader /> :
                    permissions.length === 0 ?
                    <p className='messageNoPermission'>Il n'existe aucune permission.</p> :
                    <div className='filterAndPermissions'>
                        <Filters displayStates={false} />
                        <div className='permissionsListAndPagination'>
                            {
                                permissions
                                .filter((permission) => (
                                    permission.id.toString().includes(filter.search.toString()) || 
                                    helpers.replaceAccent(permission.name).toLowerCase().includes(helpers.replaceAccent(filter.search).toString().toLowerCase()) || 
                                    helpers.replaceAccent(permission.description).toLowerCase().includes(helpers.replaceAccent(filter.search).toString().toLowerCase())
                                )).length === 0 ?
                                <p className='messageNoPermission'>Aucune permission ne correspond à votre recherche.</p> :
                                <ul className='permissionsList'>
                                    {
                                        permissions
                                            .filter((permission) => (
                                                permission.id.toString().includes(filter.search.toString()) || 
                                                helpers.replaceAccent(permission.name).toLowerCase().includes(helpers.replaceAccent(filter.search).toString().toLowerCase()) || 
                                                helpers.replaceAccent(permission.description).toLowerCase().includes(helpers.replaceAccent(filter.search).toString().toLowerCase())
                                            ))
                                            .map((permission) => (
                                                <PermissionCard 
                                                    key={permission.id}
                                                    id={permission.id}
                                                    name={permission.name}
                                                    description={permission.description}
                                                />
                                            ))
                                            .slice(firstItemIndex, lastItemIndex)
                                    }
                                </ul>
                            }
                            {
                                permissions
                                .filter((permission) => (
                                    permission.id.toString().includes(filter.search.toString()) || 
                                    helpers.replaceAccent(permission.name).toLowerCase().includes(helpers.replaceAccent(filter.search).toString().toLowerCase()) || 
                                    helpers.replaceAccent(permission.description).toLowerCase().includes(helpers.replaceAccent(filter.search).toString().toLowerCase())
                                )).length > paginationParams.permissionsPerPage ?
                                <Pagination
                                    totalItems={
                                        permissions
                                            .filter((permission) => (
                                                permission.id.toString().includes(filter.search.toString()) || 
                                                helpers.replaceAccent(permission.name).toLowerCase().includes(helpers.replaceAccent(filter.search).toString().toLowerCase()) || 
                                                helpers.replaceAccent(permission.description).toLowerCase().includes(helpers.replaceAccent(filter.search).toString().toLowerCase())
                                            )).length
                                        }
                                    itemsPerPage={paginationParams.permissionsPerPage}
                                    setCurrentPage={setCurrentPage}
                                    currentPage={currentPage}/> : null
                            }
                        </div>
                    </div>
            }  
        </div>
    )
}
