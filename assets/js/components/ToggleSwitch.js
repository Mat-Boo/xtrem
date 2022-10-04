import React, { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateAnswerModalForChangeState, updateAlertMessage, updateModal } from '../redux/redux';
import Axios from '../_services/caller_service';

export default function ToggleSwitch({ idPartner, namePartner, idClub, nameClub, nameToggle, idToggle, typeToggle, isActive, roles, isEnabled }) {

    const [stateSwitch, setStateSwitch] = useState(isActive);

    const handleChange = (e) => {
        setStateSwitch(e.target.checked);
    }

    const dispatchModal = useDispatch();
    const stockModalInfosInStore = (data) => {
        dispatchModal(updateModal(data))
    }
    
    const clickSwitch = (e, idPartner, idClub, idToggle, nameToggle) => {
        console.log(isEnabled)
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
                            title: 'Désactivation du partenaire <b>' + nameToggle + '</b>',
                            message: 'Voulez-vous vraiment désactiver le partenaire <b>' + nameToggle + '</b> ?\nCe partenaire ainsi que ses clubs seront désactivés et ne pourront plus accéder à leur interface.'
                        })
                    } else {
                        stockModalInfosInStore({
                            idPartner: idPartner,
                            idClub: idClub,
                            idToggle: idToggle,
                            nameToggle: nameToggle,
                            typeToggle: typeToggle,
                            action: 'changeState',
                            title: 'Activation du partenaire <b>' + nameToggle + '</b>',
                            message: 'Voulez-vous vraiment activer le partenaire <b>' + nameToggle + '</b> ?\nCe partenaire pourra accéder à son interface.\nVous devrez activer ses clubs un par un dans la rubrique "Gérer les clubs".'
                        })
                    }
                break;
                case 'permission':
                    if (namePartner !== undefined) {
                        if (stateSwitch) {
                            stockModalInfosInStore({
                                idPartner: idPartner,
                                idClub: idClub,
                                idToggle: idToggle,
                                nameToggle: nameToggle,
                                typeToggle: typeToggle,
                                action: 'changeState',
                                title: 'Désactivation de la permission <b>' + nameToggle + '</b>',
                                message: 'Voulez-vous vraiment désactiver la permission <b>' + nameToggle + '</b> pour le partenaire <b>' + namePartner + '</b> ?\nSes clubs n\'auront plus accès à cette permission.'
                            })
                        } else {
                            stockModalInfosInStore({
                                idPartner: idPartner,
                                idClub: idClub,
                                idToggle: idToggle,
                                nameToggle: nameToggle,
                                typeToggle: typeToggle,
                                action: 'changeState',
                                title: 'Activation de la permission <b>' + nameToggle + '</b>',
                                message: 'Voulez-vous vraiment activer la permission <b>' + nameToggle + '</b> pour le partenaire <b>' + namePartner + '</b> ?\nIl vous sera possible d\'activer cette permission pour les clubs de ce partenaire.'
                            })
                        }
                    }
                    if (nameClub !== undefined) {
                        if (stateSwitch) {
                            stockModalInfosInStore({
                                idPartner: idPartner,
                                idClub: idClub,
                                idToggle: idToggle,
                                nameToggle: nameToggle,
                                typeToggle: typeToggle,
                                action: 'changeState',
                                title: 'Désactivation de la permission <b>' + nameToggle + '</b>',
                                message: 'Voulez-vous vraiment désactiver la permission <b>' + nameToggle + '</b> pour le club <b>' + nameClub + '</b> ?'
                            })
                        } else {
                            stockModalInfosInStore({
                                idPartner: idPartner,
                                idClub: idClub,
                                idToggle: idToggle,
                                nameToggle: nameToggle,
                                typeToggle: typeToggle,
                                action: 'changeState',
                                title: 'Activation de la permission <b>' + nameToggle + '</b>',
                                message: 'Voulez-vous vraiment activer la permission <b>' + nameToggle + '</b> pour le club <b>' + nameClub + '</b> ?'
                            })
                        }
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
                            title: 'Désactivation du club <b>' + nameToggle + '</b>',
                            message: 'Voulez-vous vraiment désactiver le club <b>' + nameToggle + '</b> ?\nLe manager de ce club ne pourra plus accéder à son interface.'
                        })
                    } else {
                        stockModalInfosInStore({
                            idPartner: idPartner,
                            idClub: idClub,
                            idToggle: idToggle,
                            nameToggle: nameToggle,
                            typeToggle: typeToggle,
                            action: 'changeState',
                            title: 'Activation du club <b>' + nameToggle + '</b>',
                            message: 'Voulez-vous vraiment activer le club <b>' + nameToggle + '</b> ?\nLe manager de ce club pourra accéder à son interface.'
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
                Axios.post('/api/partner/' + answerModal.idToggle + '/edit', formData, {
                    'content-type': 'multipart/form-data',
                })
                .then(response => {
                    setStateSwitch(!stateSwitch);
                    if (!stateSwitch) {
                        stockAlertMessageInStore({type: 'success', content: 'Le partenaire <b>' + answerModal.nameToggle + '</b> a bien été activé.'})
                    } else {
                        stockAlertMessageInStore({type: 'success', content: 'Le partenaire <b>' + answerModal.nameToggle + '</b> ainsi que ses clubs ont bien été désactivés.'})
                    }
                })
                .catch(error => {
                    if (!stateSwitch) {
                        stockAlertMessageInStore({type: 'error', content: 'Le partenaire <b>' + answerModal.nameToggle + '</b> n\'a pu être activé.'})
                    } else {
                        stockAlertMessageInStore({type: 'error', content: 'Le partenaire <b>' + answerModal.nameToggle + '</b> ainsi que ses clubs n\'ont pu être désactivés.'})
                    }
                });
                break;
            case 'permission':
                if (answerModal.idPartner !== undefined && answerModal.idClub === undefined) {
                    Axios.post('/api/partner-permission/' + answerModal.idPartner + '/' + answerModal.idToggle + '/edit', formData, {
                        'content-type': 'multipart/form-data',
                    })
                    .then(response => {
                        setStateSwitch(!stateSwitch);
                        if (!stateSwitch) {
                            stockAlertMessageInStore({type: 'success', content: 'La permission <b>' + answerModal.nameToggle + '</b> a bien été activée pour le partenaire <b>'  + response.data[0].Partner.name + '</b>.'})
                        } else {
                            stockAlertMessageInStore({type: 'success', content: 'La permission <b>' + answerModal.nameToggle + '</b> a bien été désactivée pour le partenaire <b>'  + response.data[0].Partner.name + '</b> et retirée pour ses clubs.'})
                        }
                    })
                    .catch(error => {
                        if (!stateSwitch) {
                            stockAlertMessageInStore({type: 'error', content: 'La permission <b>' + answerModal.nameToggle + '</b> n\'a pu être activée.'})
                        } else {
                            stockAlertMessageInStore({type: 'error', content: 'La permission <b>' + answerModal.nameToggle + '</b> n\'a pu être désactivée.'})
                        }
                    });
                } else if (answerModal.idClub !== undefined) {
                    Axios.post('/api/club-permission/' + answerModal.idClub + '/' + answerModal.idToggle + '/edit', formData, {
                        'content-type': 'multipart/form-data',
                    })
                    .then(response => {
                        setStateSwitch(!stateSwitch);
                        if (!stateSwitch) {
                            stockAlertMessageInStore({type: 'success', content: 'La permission <b>' + response.data[0].PartnerPermissions.Permission.name + '</b> a bien été activée pour le club <b>'  + response.data[0].Club.name + '</b>.'})
                        } else {
                            stockAlertMessageInStore({type: 'success', content: 'La permission <b>' + response.data[0].PartnerPermissions.Permission.name + '</b> a bien été désactivée pour le club <b>'  + response.data[0].Club.name + '</b>.'})
                        }
                    })
                    .catch(error => {
                        if (!stateSwitch) {
                            stockAlertMessageInStore({type: 'error', content: 'La permission <b>' + answerModal.nameToggle + '</b> n\'a pu être activée.'})
                        } else {
                            stockAlertMessageInStore({type: 'error', content: 'La permission <b>' + answerModal.nameToggle + '</b> n\'a pu être désactivée.'})
                        }
                    });
                }
                break;
            case 'club':
                Axios.post('/api/club/' + answerModal.idToggle + '/edit', formData, {
                    'content-type': 'multipart/form-data',
                })
                .then(response => {
                    setStateSwitch(!stateSwitch);
                    if (!stateSwitch) {
                        stockAlertMessageInStore({type: 'success', content: 'Le club <b>' + answerModal.nameToggle + '</b> a bien été activé.'})
                    } else {
                        stockAlertMessageInStore({type: 'success', content: 'Le club <b>' + answerModal.nameToggle + '</b> a bien été désactivé.'})
                    }
                })
                .catch(error => {
                    if (!stateSwitch) {
                        stockAlertMessageInStore({type: 'error', content: 'Le club <b>' + answerModal.nameToggle + '</b> n\'a pu être activé.'})
                    } else {
                        stockAlertMessageInStore({type: 'error', content: 'Le club <b>' + answerModal.nameToggle + '</b> n\'a pu être désactivé.'})
                    }
                });
                break;
        }
        stockAnswerModalForChangeStateInStore('');
    }   
    
    return (
        <label id={idToggle} className='toggleSwitch' onClick={roles.includes('ROLE_TECHNICAL') && isEnabled ? (e) => clickSwitch(e, idPartner, idClub, idToggle, nameToggle) : null} style={!roles.includes('ROLE_TECHNICAL') || !isEnabled ? {opacity: 0.5, cursor: 'not-allowed'} : null}>
            <input type="checkbox" id={idToggle} name={typeToggle} onChange={e => handleChange(e)} checked={stateSwitch} disabled={!roles.includes('ROLE_TECHNICAL') || !isEnabled ? true : false}/>
            <span></span>
        </label>
    )
}
