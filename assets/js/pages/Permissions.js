import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PermissionCard from '../components/PermissionCard';
import Button from '../components/Button';

export default function Permissions() {

    const [permissions, setPermissions] = useState([]);

    useEffect(() => {
      axios.get('http://127.0.0.1:8000/api/permissions')
      .then((res) => {
        setPermissions(res.data);
      })
    
    }, [])

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
