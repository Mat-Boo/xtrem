import React, { useState, useEffect }  from 'react';
import Button from '../../../components/Button';
import Axios from '../../../_services/caller_service';
import { useParams } from 'react-router-dom';

export default function ViewPermission() {

    const [permission, setPermission] = useState([]);

    const id = useParams().idSlug.substring(0, useParams().idSlug.indexOf('-', 0))
    
     useEffect(() => {
        document.title = 'Permission | Xtrem';
      Axios.get('/api/permission/' + id)
      .then((res) => {
        setPermission(res.data);
      })
    }, [])


    return (
        <>
            {
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
