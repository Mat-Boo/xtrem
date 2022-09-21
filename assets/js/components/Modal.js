import React, { useEffect, useState } from 'react';
import Button from './Button';
import { useDispatch, useSelector } from 'react-redux';
import { updateAnswerModal, updateModal, updateTypeButton} from '../redux/redux';

export default function Modal() {

    const [displayModal, setDisplayModal] = useState();

    const modalInfos = useSelector((state) => state.modal);
    const dispatchModal = useDispatch();
    const stockModalInfosInStore = (data) => {
        dispatchModal(updateModal(data))
    }
    
    const typeButtonClicked = useSelector((state) => state.typeButton);
    const dispatchTypeButton = useDispatch();
    const stockTypeButtonInStore = (data) => {
        dispatchTypeButton(updateTypeButton(data))
    }

    const dispatchAnswerModal = useDispatch();
    const stockAnswerModalInStore = (data) => {
        dispatchAnswerModal(updateAnswerModal(data))
    }

    useEffect(() => {
        if (modalInfos) {
            setDisplayModal(true);
            document.body.style.overflow= 'hidden';
        } else {
            setDisplayModal(false);
            document.body.style.overflow= 'auto';
        }    
    }, [modalInfos])
    
    switch(typeButtonClicked) {
        case 'cancel':
            stockModalInfosInStore('');
            stockTypeButtonInStore('');
        break;
        case 'confirm':
            stockAnswerModalInStore({id: modalInfos.id, name: modalInfos.name, typeButton: 'confirm'});
            stockModalInfosInStore('');
            stockTypeButtonInStore('');
        break;
    }

    return (
        <>
            {
                displayModal &&
                    <>
                        <div className="opacityBox"></div>
                        <div className='modalConfirm'>
                            <h6>{modalInfos.title}</h6>
                            <p>{modalInfos.message}</p>
                            <div className='actionBtns'>
                                <Button
                                    type='cancel'
                                    btnSvg='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
                                        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
                                        </svg>'
                                    btnTitle='Annuler'
                                />
                                <Button
                                    type='confirm'
                                    btnSvg='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-check-lg" viewBox="0 0 16 16">
                                        <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"/>
                                        </svg>'
                                    btnTitle='Confirmer'
                                />
                            </div>
                        </div>
                    </>
            }
        </>
    )
}