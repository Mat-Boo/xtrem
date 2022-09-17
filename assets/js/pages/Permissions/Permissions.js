import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PermissionCard from '../../components/PermissionCard';
import Button from '../../components/Button';
import AlertMessage from '../../components/AlertMessage';
import { useDispatch, useSelector } from 'react-redux';
import { updateMessage } from '../../redux/redux';

export default function Permissions() {

    const [permissions, setPermissions] = useState([]);
    const message = useSelector((state) => state.message);
    const dispatchMessage = useDispatch();
    const stockInStore = (data) => {
        dispatchMessage(updateMessage(data))
    }

    useEffect(() => {
      axios.get('http://127.0.0.1:8000/api/permissions')
      .then((res) => {
        setPermissions(res.data);
      })
    }, [message])


    if (message) {
        scroll(0,0);
        setTimeout(() => {
            stockInStore(null);
        }, 4000);
    }


    return (
        <div className='permissions'>
            <div className='header'>
                <h1>Permissions</h1>
                <Button
                    type='add'
                    btnSvg='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"/>
                        </svg>'
                    btnTitle='Ajouter'
                    btnUrl='/permissions/ajouter'
                />
            </div>
            {
                message && 
                    <AlertMessage type={message.type} message={message.content}/>
            }
            <ul className='permissionsList'>
                {
                    permissions.map((permission) => (
                        <PermissionCard 
                            key={permission.id}
                            id={permission.id}
                            name={permission.name}
                            description={permission.description}
                        />
                    ))
                }
            </ul>
        </div>
    )
}
