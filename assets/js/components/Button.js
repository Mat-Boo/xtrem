import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { useDispatch, useSelector } from 'react-redux';
import { updateAnswerModalForDelete, updateAlertMessage, updateModal, updateTypeButton } from '../redux/redux';
import Axios from '../_services/caller_service';

export default function Button({ idItem, nameItem, typeItem, typeBtn, btnSvg, btnTitle, btnUrl }) {

    const navigate = useNavigate();

    const typeButtonClicked = useSelector((state) => state.typeButton);
    const dispatchTypeButton = useDispatch();
    const stockTypeButtonInStore = (data) => {
        dispatchTypeButton(updateTypeButton(data))
    }

    const dispatchModal = useDispatch();
    const stockModalInfosInStore = (data) => {
        dispatchModal(updateModal(data))
    }

    const onClick = () => {
        stockTypeButtonInStore(typeBtn);
        if (typeBtn === 'delete') {
            switch (typeItem) {
                case 'partner':
                    stockModalInfosInStore({
                        idItem: idItem,
                        nameItem: nameItem,
                        typeItem: typeItem,
                        action: typeBtn,
                        title: 'Suppression du partenaire ' + nameItem,
                        message: 'Voulez-vous vraiment supprimer le partenaire ' + nameItem + ' ? Ses clubs seront automatiquement supprimés aussi.'
                    })
                break;
                case 'permission':
                    stockModalInfosInStore({
                        idItem: idItem,
                        nameItem: nameItem,
                        typeItem: typeItem,
                        action: typeBtn,
                        title: 'Suppression de la permission ' + nameItem,
                        message: 'Voulez-vous vraiment supprimer la permission ' + nameItem + ' ?'
                    })
                break;
                case 'club':
                    stockModalInfosInStore({
                        idItem: idItem,
                        nameItem: nameItem,
                        typeItem: typeItem,
                        action: typeBtn,
                        title: 'Suppression du club ' + nameItem,
                        message: 'Voulez-vous vraiment supprimer le club ' + nameItem + ' ?'
                    })
                break;
            }
        }
    }

    const answerModal = useSelector((state) => state.answerModalForDelete);
    const dispatchAnswerModalForDelete = useDispatch();
    const stockAnswerModalForDeleteInStore = (data) => {
        dispatchAnswerModalForDelete(updateAnswerModalForDelete(data))
    }

    const dispatchAlertMessage = useDispatch();
    const stockAlertMessageInStore = (data) => {
        dispatchAlertMessage(updateAlertMessage(data))
    }
    
    if (idItem === answerModal.idItem && answerModal.typeButton === 'confirm') {
        switch (answerModal.typeItem) {
            case 'partner':
                Axios.post('/api/partner/' + answerModal.idItem + '/delete')
                .then(response => {
                    stockAlertMessageInStore({type: 'success', content: 'Le partenaire ' + answerModal.idItem + ' - ' + answerModal.nameItem + ' a bien été supprimé.'})
                    navigate('/partenaires');
                })
                .catch(error => {
                    stockAlertMessageInStore({type: 'error', content: 'La suppression du partenaire ' + answerModal.idItem + ' - ' + answerModal.nameItem + ' n\'a pu aboutir, merci de réessayer.'})
                });
                break;
            case 'permission':
                Axios.post('/api/permission/' + answerModal.idItem + '/delete')
                .then(response => {
                    stockAlertMessageInStore({type: 'success', content: 'La permission ' + answerModal.idItem + ' - ' + answerModal.nameItem + ' a bien été supprimée.'})
                })
                .catch(error => {
                    stockAlertMessageInStore({type: 'error', content: 'La suppression de la permission ' + answerModal.idItem + ' - ' + answerModal.nameItem + ' n\'a pu aboutir, merci de réessayer.'})
                });
                break;
            case 'club':
                Axios.post('/api/club/' + answerModal.idItem + '/delete')
                .then(response => {
                    stockAlertMessageInStore({type: 'success', content: 'Le club ' + answerModal.idItem + ' - ' + answerModal.nameItem + ' a bien été supprimé.'})
                })
                .catch(error => {
                    stockAlertMessageInStore({type: 'error', content: 'La suppression du club ' + answerModal.idItem + ' - ' + answerModal.nameItem + ' n\'a pu aboutir, merci de réessayer.'})
                });
                break;
        }
        stockAnswerModalForDeleteInStore('');
    }   



    return (
        <div className='button' id={typeBtn} onClick={onClick}>
            <NavLink to={btnUrl ? btnUrl : '#'}>
                <div className='contentSvg' dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(btnSvg)}}/>
                <span>{btnTitle}</span>
            </NavLink>
        </div>
    )
}