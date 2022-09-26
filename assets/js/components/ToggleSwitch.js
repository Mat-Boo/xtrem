import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateAnswerModalForChangeState, updateAlertMessage, updateModal } from '../redux/redux';
import axios from 'axios';

export default function ToggleSwitch({ idPartner, idClub, nameToggle, idToggle, typeToggle, isActive }) {

    const [stateSwitch, setStateSwitch] = useState(isActive);

    const handleChange = (e) => {
        setStateSwitch(e.target.checked);
    }

    const dispatchModal = useDispatch();
    const stockModalInfosInStore = (data) => {
        dispatchModal(updateModal(data))
    }
    
    const clickSwitch = (e, idPartner, idClub, idToggle, nameToggle) => {
        if (idPartner !== '' || idClub !== '') {
            e.preventDefault();
            switch (typeToggle) {
                case 'partner':
                    if (stateSwitch) {
                        stockModalInfosInStore({
                            idPartner: idPartner,
                            idClub: idClub,
                            idToggle: idToggle,
                            nameToggle: nameToggle,
                            typeToggle: typeToggle,
                            action: 'changeState',
                            title: 'Désactivation du partenaire ' + nameToggle,
                            message: 'Voulez-vous vraiment désactiver le partenaire ' + nameToggle + ' ? Ce partenaire ainsi que ses clubs ne pourront plus accéder à leur interface.'
                        })
                    } else {
                        stockModalInfosInStore({
                            idPartner: idPartner,
                            idClub: idClub,
                            idToggle: idToggle,
                            nameToggle: nameToggle,
                            typeToggle: typeToggle,
                            action: 'changeState',
                            title: 'Activation du partenaire ' + nameToggle,
                            message: 'Voulez-vous vraiment activer le partenaire ' + nameToggle + ' ? Ce partenaire pourra accéder à son interface.'
                        })
                    }
                break;
                case 'permission':
                    if (stateSwitch) {
                        stockModalInfosInStore({
                            idPartner: idPartner,
                            idClub: idClub,
                            idToggle: idToggle,
                            nameToggle: nameToggle,
                            typeToggle: typeToggle,
                            action: 'changeState',
                            title: 'Désactivation de la permission ' + nameToggle,
                            message: 'Voulez-vous vraiment désactiver la permission ' + nameToggle + ' ?'
                        })
                    } else {
                        stockModalInfosInStore({
                            idPartner: idPartner,
                            idClub: idClub,
                            idToggle: idToggle,
                            nameToggle: nameToggle,
                            typeToggle: typeToggle,
                            action: 'changeState',
                            title: 'Activation de la permission ' + nameToggle,
                            message: 'Voulez-vous vraiment activer la permission ' + nameToggle + ' ?'
                        })
                    }
                break;
                case 'club':
                    if (stateSwitch) {
                        stockModalInfosInStore({
                            idPartner: idPartner,
                            idClub: idClub,
                            idToggle: idToggle,
                            nameToggle: nameToggle,
                            typeToggle: typeToggle,
                            action: 'changeState',
                            title: 'Désactivation du club ' + nameToggle,
                            message: 'Voulez-vous vraiment désactiver le club ' + nameToggle + ' ? Ce club ne pourra plus accéder à son interface.'
                        })
                    } else {
                        stockModalInfosInStore({
                            idPartner: idPartner,
                            idClub: idClub,
                            idToggle: idToggle,
                            nameToggle: nameToggle,
                            typeToggle: typeToggle,
                            action: 'changeState',
                            title: 'Activation du club' + nameToggle,
                            message: 'Voulez-vous vraiment activer le club ' + nameToggle + ' ? Ce club pourra accéder à son interface.'
                        })
                    }
                break;
            }
        }
    }

    const answerModal = useSelector((state) => state.answerModalForChangeState);
    const dispatchAnswerModalForChangeState = useDispatch();
    const stockAnswerModalForChangeStateInStore = (data) => {
        dispatchAnswerModalForChangeState(updateAnswerModalForChangeState(data))
    }

    const dispatchAlertMessage = useDispatch();
    const stockAlertMessageInStore = (data) => {
        dispatchAlertMessage(updateAlertMessage(data))
    }
    
    if (idToggle === answerModal.idToggle && answerModal.typeButton === 'confirm') {
        const formData = new FormData();
        formData.append('isActive', !stateSwitch ? 1 : 0);
        switch (answerModal.typeToggle) {
            case 'partner':
                axios.post('http://127.0.0.1:8000/api/partner/' + answerModal.idToggle + '/edit', formData, {
                    'content-type': 'multipart/form-data',
                })
                .then(response => {
                    setStateSwitch(!stateSwitch);
                    if (!stateSwitch) {
                        stockAlertMessageInStore({type: 'success', content: 'Le partenaire ' + answerModal.idToggle + ' - ' + answerModal.nameToggle + ' a bien été activé.'})
                    } else {
                        stockAlertMessageInStore({type: 'success', content: 'Le partenaire ' + answerModal.idToggle + ' - ' + answerModal.nameToggle + ' a bien été désactivé.'})
                    }
                })
                .catch(error => {
                    if (!stateSwitch) {
                        stockAlertMessageInStore({type: 'error', content: 'Le partenaire ' + answerModal.idToggle + ' - ' + answerModal.nameToggle + ' n\'a pu être activé.'})
                    } else {
                        stockAlertMessageInStore({type: 'error', content: 'Le partenaire ' + answerModal.idToggle + ' - ' + answerModal.nameToggle + ' n\'a pu être désactivé.'})
                    }
                });
                break;
            case 'permission':
                if (answerModal.idPartner !== '') {
                    axios.post('http://127.0.0.1:8000/api/partner-permission/' + answerModal.idPartner + '/' + answerModal.idToggle + '/edit', formData, {
                        'content-type': 'multipart/form-data',
                    })
                    .then(response => {
                        setStateSwitch(!stateSwitch);
                        if (!stateSwitch) {
                            stockAlertMessageInStore({type: 'success', content: 'La permission ' + answerModal.idToggle + ' - ' + answerModal.nameToggle + ' a bien été activée pour le partenaire '  + answerModal.idPartner + ' - ' + response.data[0].Partner.name + '.'})
                        } else {
                            stockAlertMessageInStore({type: 'success', content: 'La permission ' + answerModal.idToggle + ' - ' + answerModal.nameToggle + ' a bien été désactivée pour le partenaire '  + answerModal.idPartner + ' - ' + response.data[0].Partner.name + '.'})
                        }
                    })
                    .catch(error => {
                        console.log(error)
                        if (!stateSwitch) {
                            stockAlertMessageInStore({type: 'error', content: 'La permission ' + answerModal.idToggle + ' - ' + answerModal.nameToggle + ' n\'a pu être activée.'})
                        } else {
                            stockAlertMessageInStore({type: 'error', content: 'La permission ' + answerModal.idToggle + ' - ' + answerModal.nameToggle + ' n\'a pu être désactivée.'})
                        }
                    });
                } /* else if (answerModal.idClub !== '') {
                    axios.post('http://127.0.0.1:8000/api/club-permission/' + answerModal.idClub + '/' + answerModal.idToggle + '/edit', formData, {
                        'content-type': 'multipart/form-data',
                    })
                    .then(response => {
                        setStateSwitch(!stateSwitch);
                        if (!stateSwitch) {
                            stockAlertMessageInStore({type: 'success', content: 'La permission ' + answerModal.idToggle + ' - ' + answerModal.nameToggle + ' a bien été activée pour le club '  + answerModal.idClub + ' - ' + response.data[0].Club.name + '.'})
                        } else {
                            stockAlertMessageInStore({type: 'success', content: 'La permission ' + answerModal.idToggle + ' - ' + answerModal.nameToggle + ' a bien été désactivée pour le club '  + answerModal.idClub + ' - ' + response.data[0].Club.name + '.'})
                        }
                    })
                    .catch(error => {
                        console.log(error)
                        if (!stateSwitch) {
                            stockAlertMessageInStore({type: 'error', content: 'La permission ' + answerModal.idToggle + ' - ' + answerModal.nameToggle + ' n\'a pu être activée.'})
                        } else {
                            stockAlertMessageInStore({type: 'error', content: 'La permission ' + answerModal.idToggle + ' - ' + answerModal.nameToggle + ' n\'a pu être désactivée.'})
                        }
                    });
                } */
                break;
            /* case 'club':
                axios.post('http://127.0.0.1:8000/api/club/' + answerModal.idToggle + '/edit', formData, {
                    'content-type': 'multipart/form-data',
                })
                .then(response => {
                    setStateSwitch(!stateSwitch);
                    if (!stateSwitch) {
                        stockAlertMessageInStore({type: 'success', content: 'Le club ' + answerModal.idToggle + ' - ' + answerModal.nameToggle + ' a bien été activé.'})
                    } else {
                        stockAlertMessageInStore({type: 'success', content: 'Le club ' + answerModal.idToggle + ' - ' + answerModal.nameToggle + ' a bien été désactivé.'})
                    }
                })
                .catch(error => {
                    if (!stateSwitch) {
                        stockAlertMessageInStore({type: 'error', content: 'Le club ' + answerModal.idToggle + ' - ' + answerModal.nameToggle + ' n\'a pu être activé.'})
                    } else {
                        stockAlertMessageInStore({type: 'error', content: 'Le club ' + answerModal.idToggle + ' - ' + answerModal.nameToggle + ' n\'a pu être désactivé.'})
                    }
                });
                break; */
        }
        stockAnswerModalForChangeStateInStore('');
    }   

    return (
        <label id={idToggle} className='toggleSwitch' onClick={(e) => clickSwitch(e, idPartner, idClub, idToggle, nameToggle)}>
            <input type="checkbox" id={idToggle} name={typeToggle} onChange={e => handleChange(e)} checked={stateSwitch}/>
            <span></span>
        </label>
    )
}
