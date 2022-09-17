import React, { useEffect, useState } from 'react';
import slugify from 'react-slugify';
import Button from '../components/Button';
import SwitchToggle from './SwitchToggle';
import Modal from '../components/Modal';
import axios from 'axios';
import { useDispatch } from 'react-redux'
import { updateMessage } from '../redux/redux';
import { useNavigate } from 'react-router-dom';

export default function PartnerCard({ id, logo, name, description, isActive }) {

    const [displayModal, setDisplayModal] = useState(false);
    const [modalTitle, setModalTitle] = useState();
    const [modalMessage, setModalMessage] = useState();
    const [styleSwitch, setStyleSwitch] = useState(
        {
            id: '',
            background: '',
            justifyContent: ''
        }
    )

    const [partnerState, setPartnerState] = useState(isActive); 

    const dispatchMessage = useDispatch();
    const stockInStore = (data) => {
        dispatchMessage(updateMessage(data))
    }

    const clickSwitch = (name) => {
        document.body.style.overflow= 'hidden';
        setDisplayModal(true);
        if (partnerState) {
            setModalTitle('Désactivation du partenaire ' + name);
            setModalMessage('Voulez-vous vraiment désactiver le partenaire ' + name + ' ? Ce partenaire ainsi que ses clubs ne pourront plus accéder à leur interface.');
        } else {
            setModalTitle('Activation du partenaire ' + name);
            setModalMessage('Voulez-vous vraiment activer le partenaire ' + name + ' ? Ce partenaire pourra accéder à son interface.');
        }
    }

    const answerModal = (type) => {
        if (type === 'cancel') {
            setDisplayModal(false);
            document.body.style.overflow= 'auto';
        } else if (type === 'confirm') {
            setDisplayModal(false);
            document.body.style.overflow= 'auto';
            if (partnerState) {
                setStyleSwitch({id: id, background: '#ECACAC', justifyContent: 'flex-start'});
            } else {
                setStyleSwitch({id: id, background: '#3F72AE', justifyContent: 'flex-end'});
            }
            setPartnerState(!partnerState);
            axios.put('http://127.0.0.1:8000/api/partner/' + id + '/edit', {
                isActive: !partnerState
            })
            .then(response => {
                if (!partnerState) {
                    stockInStore({type: 'success', content: 'Le partenaire ' + id + ' - ' + name + ' a bien été activé.'})
                } else {
                    stockInStore({type: 'success', content: 'Le partenaire ' + id + ' - ' + name + ' a bien été désactivé.'})
                }
            })
            .catch(error => {
                if (!partnerState) {
                    stockInStore({type: 'error', content: 'Le partenaire ' + id + ' - ' + name + ' n\'a pus être activé.'})
                } else {
                    stockInStore({type: 'error', content: 'Le partenaire ' + id + ' - ' + name + ' n\'a pu être désactivé.'})
                }
            });
        }
    }

    return (
        <>
            <li className='partnerListItem'>    
                <div className='logoAndInfos'>
                    <img src={'/resources/img/' + logo} alt='partner-logo' className='logo'/>
                    <div className='partnerInfos'>
                        <p className='id'>{id}</p>
                        <p className='name'>{name}</p>
                        <p className='description'>{description}</p>
                        <SwitchToggle isActive={isActive} id={id} name={name} clickSwitch={clickSwitch} styleSwitch={styleSwitch}/>
                    </div>
                </div>
                <div className='actionBtns'>
                    <Button
                        type='manageClubs'
                        btnSvg='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="manageSvg" viewBox="0 0 16 16">
                            <path d="M7 2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-1zM2 1a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2H2zm0 8a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2H2zm.854-3.646a.5.5 0 0 1-.708 0l-1-1a.5.5 0 1 1 .708-.708l.646.647 1.646-1.647a.5.5 0 1 1 .708.708l-2 2zm0 8a.5.5 0 0 1-.708 0l-1-1a.5.5 0 0 1 .708-.708l.646.647 1.646-1.647a.5.5 0 0 1 .708.708l-2 2zM7 10.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-1zm0-5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0 8a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"/>
                            </svg>'
                        btnTitle='Gérer les clubs'
                        btnUrl={slugify(name) + '/clubs'}
                    />
                    <Button
                        type='details'
                        btnSvg='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="detailsSvg" viewBox="0 0 16 16">
                            <path d="M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z"/>
                            <path d="M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5L9.5 0zm0 1v2A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z"/>
                            </svg>'
                        btnTitle='Détails'
                        btnUrl={slugify(name) + '/details'}
                    />
                </div>
            </li>
            {
                displayModal &&
                <>
                    <Modal 
                        title={modalTitle}
                        message={modalMessage}
                        clickBtn={answerModal}
                    />
                </>
            }
        </>
    )
}
