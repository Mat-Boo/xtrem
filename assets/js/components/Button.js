import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { useDispatch, useSelector } from 'react-redux';
import { updateAnswerModalForDelete, updateAlertMessage, updateModal, updateTypeButton, updateAxiosAnswer } from '../redux/redux';
import Axios from '../_services/caller_service';

export default function Button({ idItem, nameItem, typeItem, typeBtn, btnSvg, btnTitle, btnUrl, isActive }) {

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

    const dispatchAxiosAnswer = useDispatch();
    const stockAxiosAnswerInStore = (data) => {
        dispatchAxiosAnswer(updateAxiosAnswer(data))
    }
    
    if (idItem === answerModal.idItem && answerModal.typeButton === 'confirm') {
        switch (answerModal.typeItem) {
            case 'partner':
                Axios.post('/api/partner/' + answerModal.idItem + '/delete')
                .then(response => {
                    stockAlertMessageInStore({type: 'success', content: 'Le partenaire <b>' + answerModal.nameItem + '</b> a bien été supprimé.'})
                    navigate('/partenaires');
                })
                .catch(error => {
                    stockAlertMessageInStore({type: 'error', content: 'La suppression du partenaire <b>' + answerModal.nameItem + '</b> n\'a pu aboutir, merci de réessayer.'})
                });
                break;
            case 'permission':
                Axios.post('/api/permission/' + answerModal.idItem + '/delete')
                .then(response => {
                    stockAlertMessageInStore({type: 'success', content: 'La permission <b>' + answerModal.nameItem + '</b> a bien été supprimée.'})
                })
                .catch(error => {
                    stockAlertMessageInStore({type: 'error', content: 'La suppression de la permission <b>' + answerModal.nameItem + '</b> n\'a pu aboutir, merci de réessayer.'})
                });
                break;
            case 'club':
                Axios.post('/api/club/' + answerModal.idItem + '/delete')
                .then(response => {
                    stockAlertMessageInStore({type: 'success', content: 'Le club <b>' + answerModal.nameItem + '</b> a bien été supprimé.'})
                    stockAxiosAnswerInStore('success');
                })
                .catch(error => {
                    stockAlertMessageInStore({type: 'error', content: 'La suppression du club <b>' + answerModal.nameItem + '</b> n\'a pu aboutir, merci de réessayer.'})
                    stockAxiosAnswerInStore('error');
                });
                break;
        }
        stockAnswerModalForDeleteInStore('');
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