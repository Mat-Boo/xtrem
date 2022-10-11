import React, { useEffect, useState } from 'react';
import Button from './Button';
import { useDispatch, useSelector } from 'react-redux';
import { updateAnswerModalForChangeState, updateAnswerModalForDelete, updateModal, updateTypeButton} from '../redux/redux';
import { helpers } from '../_services/helpers';
import { checkToken } from '../_services/checkToken';

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

    const dispatchAnswerModalForChangeState = useDispatch();
    const stockAnswerModalForChangeStateInStore = (data) => {
        dispatchAnswerModalForChangeState(updateAnswerModalForChangeState(data))
    }

    const dispatchAnswerModalForDelete = useDispatch();
    const stockAnswerModalForDeleteInStore = (data) => {
        dispatchAnswerModalForDelete(updateAnswerModalForDelete(data))
    }

    useEffect(() => {
        if (modalInfos !== '') {
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
            if (modalInfos.action === 'changeState') {
                stockAnswerModalForChangeStateInStore(
                    {
                        idPartner: modalInfos.idPartner,
                        idClub: modalInfos.idClub,
                        idToggle: modalInfos.idToggle,
                        nameToggle: modalInfos.nameToggle,
                        typeToggle: modalInfos.typeToggle,
                        typeButton: 'confirm'
                    });
                stockModalInfosInStore('');
                stockTypeButtonInStore('');
            } else if (modalInfos.action === 'delete') {
                stockAnswerModalForDeleteInStore(
                    {
                        idItem: modalInfos.idItem,
                        nameItem: modalInfos.nameItem,
                        typeItem: modalInfos.typeItem,
                        typeButton: 'confirm'
                    });
                stockModalInfosInStore('');
                stockTypeButtonInStore('');
            }
        break;
    }

    return (
        <>
            {
                displayModal &&
                    <>
                        <div className="opacityBox"></div>
                        <div className='modalConfirm'>
                            <h6 dangerouslySetInnerHTML={helpers.sanitizedData(modalInfos.title)}></h6>
                            <p dangerouslySetInnerHTML={helpers.sanitizedData(modalInfos.message)}></p>
                            <div className='actionBtns'>
                                <Button
                                    typeBtn='cancel'
                                    btnSvg='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
                                        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
                                        </svg>'
                                    btnTitle='Annuler'
                                    isActive={true}
                                />
                                <Button
                                    typeBtn='confirm'
                                    btnSvg='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-check-lg" viewBox="0 0 16 16">
                                        <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"/>
                                        </svg>'
                                    btnTitle='Confirmer'
                                    isActive={true}
                                />
                            </div>
                        </div>
                    </>
            }
        </>
    )
}