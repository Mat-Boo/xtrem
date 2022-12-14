import React, { useState, useEffect }  from 'react';
import { useParams } from 'react-router-dom';
import Button from '../../../components/Button';
import Loader from '../../../components/Loader';
import {Helmet} from "react-helmet";
import { updateLoader } from '../../../redux/redux';
import { useDispatch } from 'react-redux';
import { axiosCaller } from '../../../_services/axiosCaller';

export default function ViewPermission() {

    const [permission, setPermission] = useState([]);

    const id = useParams().idSlug.substring(0, useParams().idSlug.indexOf('-', 0));

    // Gestion du loader, gif s'affichant pendant l'appel d'Axios avant le retour de sa réponse
    const [loader, setLoader] = useState(true);
    const dispatchLoader = useDispatch();
    const stockLoaderInStore = (data) => {
        dispatchLoader(updateLoader(data))
    }
    
    useEffect(() => {
        stockLoaderInStore(true);
        axiosCaller.askCsrf()
        .then((response) => {
            axiosCaller.callAxios('/api/permission/' + id, 'GET', response.data)
            .then((response) => {
                setPermission(response.data);
                setLoader(false);
                stockLoaderInStore(false);
            })
        })
    }, [])


    return (
        <>
            <Helmet>
                <title>Permission | Xtrem</title>
                <meta name="description" content="Xtrem, visualisation des informations d'une permission." />
            </Helmet>
            {
                loader ? 
                    <Loader /> :
                permission.name &&
                    <div className='viewPermission'>
                        <div className='header'>
                            <h1>{permission.id} | {permission.name}</h1>
                        </div>
                        <div className='descriptionAndBtn'>
                            <div className='descriptionItem'>
                                <span>Description</span>
                                <span className='description'>{permission.description}</span>
                            </div>
                            <div className="actionBtns">
                                <Button 
                                    typeBtn='back'
                                    btnSvg='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-chevron-left" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
                                        </svg>'
                                    btnTitle='Retour'
                                    btnUrl='/permissions'
                                    isActive={true}
                                />
                            </div>
                        </div>
                    </div>
            }
        </>
    )
}
