import React, { useState } from 'react'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateAlertMessage } from '../redux/redux';

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
            }, 4000);
        } else {
            setDisplayAlertMessage(false);
        } 
    }, [alertMessage])

    return (
        <>
            {
                alertMessage && alertMessage.type === 'success' ? 
                    <p style={{background: '#9EE4AD', color: '#1D662C'}} className='alertMessage'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-check-circle-fill" viewBox="0 0 16 16">
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                        </svg>
                        {alertMessage.content}
                    </p> : 
                ( alertMessage && alertMessage.type === 'error' ? 
                    <p style={{background: '#ECACAC', color: '#7D1D1D'}} className='alertMessage'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
                        </svg>
                        {alertMessage.content}
                    </p> : ''
                )
            }
        </>
    )
}
