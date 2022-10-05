import React, { useState } from 'react'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateAlertMessage } from '../redux/redux';
import { helpers } from '../_services/helpers';

export default function AlertMessage() {

    const alertMessage = useSelector((state) => state.alertMessage);
    const dispatchAlertMessage = useDispatch();
    const stockAlertMessageInStore = (data) => {
        dispatchAlertMessage(updateAlertMessage(data))
    }

    const [displayAlertMessage, setDisplayAlertMessage] = useState();

    useEffect(() => {
        if (alertMessage) {
            setDisplayAlertMessage(true);
            scroll(0,0);
            setTimeout(() => {
                stockAlertMessageInStore(null);
                setDisplayAlertMessage(false);
            }, 5000);
        } else {
            setDisplayAlertMessage(false);
        } 
    }, [alertMessage])

    return (
        <>
            {
                alertMessage && alertMessage.type === 'success' ? 
                    <p style={{background: '#9EE4AD', color: '#1D662C', left: '50%', transform: 'translateX(-50%)'}} className='alertMessage'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-check-circle-fill" viewBox="0 0 16 16">
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                        </svg>
                        <span dangerouslySetInnerHTML={helpers.sanitizedData(alertMessage.content)}></span>
                    </p> : 
                ( alertMessage && alertMessage.type === 'error' ? 
                    <p style={{background: '#ECACAC', color: '#7D1D1D', left: '50%', transform: 'translateX(-50%)'}} className='alertMessage'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
                        </svg>
                        <span dangerouslySetInnerHTML={helpers.sanitizedData(alertMessage.content)}></span>
                    </p> : ( alertMessage && alertMessage.type === 'info' ? 
                    <p style={{background: '#BECEE1', color: '#112D4E', right: '10px'}} className='alertMessage'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-info-circle-fill" viewBox="0 0 16 16">
                            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
                        </svg>
                        <span dangerouslySetInnerHTML={helpers.sanitizedData(alertMessage.content)}></span>
                    </p> : ''
                    )
                )
            }
        </>
    )
}
