import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { useDispatch, useSelector } from 'react-redux';
import { updateAnswerModalForDelete, updateAlertMessage, updateModal, updateTypeButton, updateAxiosAnswer, updateAnswerModalForResetAccess } from '../redux/redux';
import Axios from '../_services/caller_service';

export default function Button({ idItem, nameItem, typeItem, nameUser, typeBtn, btnSvg, btnTitle, btnUrl, isActive }) {

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
                        title: 'Suppression du partenaire <b>' + nameItem + '</b>',
                        message: 'Voulez-vous vraiment supprimer le partenaire <b>' + nameItem + '</b> ?\nSes clubs seront automatiquement supprimés aussi.'
                    })
                break;
                case 'permission':
                    stockModalInfosInStore({
                        idItem: idItem,
                        nameItem: nameItem,
                        typeItem: typeItem,
                        action: typeBtn,
                        title: 'Suppression de la permission <b>' + nameItem + '</b>',
                        message: 'Voulez-vous vraiment supprimer la permission <b>' + nameItem + '</b> ?'
                    })
                break;
                case 'club':
                    if (isActive) {
                        stockModalInfosInStore({
                            idItem: idItem,
                            nameItem: nameItem,
                            typeItem: typeItem,
                            action: typeBtn,
                            title: 'Suppression du club <b>' + nameItem + '</b>',
                            message: 'Voulez-vous vraiment supprimer le club <b>' + nameItem + '</b> ?'
                        })
                    }
                break;
            }
        }
        if (typeBtn === 'resetAccess') {
            switch (typeItem) {
                case 'partner':
                    stockModalInfosInStore({
                        idItem: idItem,
                        nameItem: nameItem,
                        nameUser: nameUser,
                        typeItem: typeItem,
                        action: typeBtn,
                        title: 'Réinitialisation de l\'accès de <b>' + nameUser + '</b>',
                        message: 'Voulez-vous vraiment réinitialiser l\'accès de <b>' + nameUser + '</b>, Contact du partenaire <b>' + nameItem + '</b> ?'
                    })
                break;
                case 'club':
                    if (isActive) {
                        stockModalInfosInStore({
                            idItem: idItem,
                            nameItem: nameItem,
                            nameUser: nameUser,
                            typeItem: typeItem,
                            action: typeBtn,
                            title: 'Réinitialisation de l\'accès de <b>' + nameUser + '</b>',
                        message: 'Voulez-vous vraiment réinitialiser l\'accès de <b>' + nameUser + '</b>, Manager du club <b>' + nameItem + '</b> ?'
                        })
                    }
                break;
            }
        }
    }

    const answerModalForDelete = useSelector((state) => state.answerModalForDelete);
    const dispatchAnswerModalForDelete = useDispatch();
    const stockAnswerModalForDeleteInStore = (data) => {
        dispatchAnswerModalForDelete(updateAnswerModalForDelete(data))
    }

    const answerModalForResetAccess = useSelector((state) => state.answerModalForResetAccess);
    const dispatchAnswerModalForResetAccess = useDispatch();
    const stockAnswerModalForResetAccessInStore = (data) => {
        dispatchAnswerModalForResetAccess(updateAnswerModalForResetAccess(data))
    }

    const dispatchAlertMessage = useDispatch();
    const stockAlertMessageInStore = (data) => {
        dispatchAlertMessage(updateAlertMessage(data))
    }

    const dispatchAxiosAnswer = useDispatch();
    const stockAxiosAnswerInStore = (data) => {
        dispatchAxiosAnswer(updateAxiosAnswer(data))
    }
    
    if (idItem === answerModalForDelete.idItem && answerModalForDelete.typeButton === 'confirm') {
        switch (answerModalForDelete.typeItem) {
            case 'partner':
                Axios.post('/api/partner/' + answerModalForDelete.idItem + '/delete')
                .then(response => {
                    stockAlertMessageInStore({type: 'success', content: 'Le partenaire <b>' + answerModalForDelete.nameItem + '</b> a bien été supprimé.'})
                    navigate('/partenaires');
                })
                .catch(error => {
                    stockAlertMessageInStore({type: 'error', content: 'La suppression du partenaire <b>' + answerModalForDelete.nameItem + '</b> n\'a pu aboutir, merci de réessayer.'})
                });
                break;
            case 'permission':
                Axios.post('/api/permission/' + answerModalForDelete.idItem + '/delete')
                .then(response => {
                    stockAlertMessageInStore({type: 'success', content: 'La permission <b>' + answerModalForDelete.nameItem + '</b> a bien été supprimée.'})
                })
                .catch(error => {
                    stockAlertMessageInStore({type: 'error', content: 'La suppression de la permission <b>' + answerModalForDelete.nameItem + '</b> n\'a pu aboutir, merci de réessayer.'})
                });
                break;
            case 'club':
                Axios.post('/api/club/' + answerModalForDelete.idItem + '/delete')
                .then(response => {
                    stockAlertMessageInStore({type: 'success', content: 'Le club <b>' + answerModalForDelete.nameItem + '</b> a bien été supprimé.'})
                    stockAxiosAnswerInStore('success');
                })
                .catch(error => {
                    stockAlertMessageInStore({type: 'error', content: 'La suppression du club <b>' + answerModalForDelete.nameItem + '</b> n\'a pu aboutir, merci de réessayer.'})
                    stockAxiosAnswerInStore('error');
                });
                break;
        }
        stockAnswerModalForDeleteInStore('');
    }

    if (idItem === answerModalForResetAccess.idItem && answerModalForResetAccess.typeButton === 'confirm') {
                Axios.post('/api/user/' + answerModalForResetAccess.idItem + '/reset')
                .then(response => {
                    stockAlertMessageInStore({type: 'success', content: 'L\'accès de <b>' + response.data.firstname + ' ' + response.data.lastname + '</b> a bien été réinitialisé.'})
                })
                .catch(error => {
                    stockAlertMessageInStore({type: 'error', content: 'La réinitialisation de l\'accès de  <b>' + response.data.firstname + ' ' + response.data.lastname + '</b> n\'a pu aboutir, merci de réessayer.'})
                });
        stockAnswerModalForResetAccessInStore('');
    }  

    return (
        <div className='button' id={typeBtn} onClick={onClick} style={{opacity: !isActive  ? 0.5 : ''}}>
            <NavLink to={btnUrl && isActive ? btnUrl : '#'} className={isActive === true ? '' : 'desactivedLink'}>
                <div className='contentSvg' dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(btnSvg)}}/>
                <span>{btnTitle}</span>
            </NavLink>
        </div>
    )
}