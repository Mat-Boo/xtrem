import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../components/Button';
import Axios from '../../_services/caller_service';
import Loader from '../../components/Loader';
import {Helmet} from "react-helmet";
import { updateLoader } from '../../redux/redux';

export default function MyAccount() {
    
    const alertMessage = useSelector((state) => state.alertMessage);
    const [user, setUser] = useState();

    const [loader, setLoader] = useState(true);
    const dispatchLoader = useDispatch();
    const stockLoaderInStore = (data) => {
        dispatchLoader(updateLoader(data))
    }
    
    useEffect(() => {
        stockLoaderInStore(true);
        Axios.get('/api/user')
        .then((response) => {
            setUser(response.data);
            setLoader(false);
            stockLoaderInStore(false);
        })
    }, [alertMessage])

    return (
        <>
            {
                loader ? 
                    <Loader /> :
                    user &&
                        <div className='myAccount'>
                            <Helmet>
                                <title>Mon compte | Xtrem</title>
                                <meta name="description" content="Xtrem, visualisation des informations personnelles." />
                            </Helmet>
                            <div className='header'>
                                <h1>Mes informations personnelles</h1>
                            </div>
                            <div className='userInfosAndBtns'>
                                <div className='userInfos'>
                                    <div className='firstnameItem infoItem'>
                                        <span>Prénom : </span>
                                        <span className='firstname valueItem'>{user.firstname}</span>
                                    </div>
                                    <div className='lastnameItem infoItem'>
                                        <span>Nom : </span>
                                        <span className='lastname valueItem'>{user.lastname}</span>
                                    </div>
                                    <div className='emailItem infoItem'>
                                        <span>Email : </span>
                                        <span className='email valueItem'>{user.email}</span>
                                    </div>
                                    {
                                        !user.roles.includes('ROLE_TECHNICAL') &&
                                            <div className='phoneItem infoItem'>
                                                <span>Téléphone : </span>
                                                <span className='phone valueItem'>{user.phone}</span>
                                            </div>
                                    }
                                </div>
                                <div className="actionBtns">
                                    <Button
                                        typeBtn='modify'
                                        btnSvg='<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16">
                                            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                                            </svg>'
                                        btnTitle='Modifier mes informations'
                                        btnUrl='modifier-mes-informations'
                                        isActive={true}
                                    />
                                    <Button
                                        typeBtn='modifyPassword'
                                        btnSvg='<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-key" viewBox="0 0 16 16">
                                            <path d="M0 8a4 4 0 0 1 7.465-2H14a.5.5 0 0 1 .354.146l1.5 1.5a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0L13 9.207l-.646.647a.5.5 0 0 1-.708 0L11 9.207l-.646.647a.5.5 0 0 1-.708 0L9 9.207l-.646.647A.5.5 0 0 1 8 10h-.535A4 4 0 0 1 0 8zm4-3a3 3 0 1 0 2.712 4.285A.5.5 0 0 1 7.163 9h.63l.853-.854a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.793-.793-1-1h-6.63a.5.5 0 0 1-.451-.285A3 3 0 0 0 4 5z"/>
                                            <path d="M4 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                                            </svg>'
                                        btnTitle='Modifier mon mot de passe'
                                        btnUrl='modifier-mon-mot-de-passe'
                                        isActive={true}
                                    />
                                </div>
                            </div>
                        </div>
            }
        </>
    )
}