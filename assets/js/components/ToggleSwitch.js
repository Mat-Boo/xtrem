import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateAnswerModal, updateMessage, updateModal } from '../redux/redux';
import axios from 'axios';

export default function ToggleSwitch({ id, type, name, checked }) {

    const [stateSwitch, setStateSwitch] = useState(checked);

    useEffect(() => {
        
    }, [])
    

    const handleChange = (e) => {
        setStateSwitch(e.target.checked);
    }

    const dispatchModal = useDispatch();
    const stockModalInfosInStore = (data) => {
        dispatchModal(updateModal(data))
    }
    
    const clickSwitch = (e, name) => {
        e.preventDefault();
        if (stateSwitch) {
            stockModalInfosInStore({
                id: id,
                name: name,
                title: 'Désactivation du partenaire ' + name,
                message: 'Voulez-vous vraiment désactiver le partenaire ' + name + ' ? Ce partenaire ainsi que ses clubs ne pourront plus accéder à leur interface.'
            })
        } else {
            stockModalInfosInStore({
                id: id,
                title: 'Activation du partenaire ' + name,
                message: 'Voulez-vous vraiment activer le partenaire ' + name + ' ? Ce partenaire pourra accéder à son interface.'
            })
        }
    }
    
    const answerModal = useSelector((state) => state.answerModal);
    const dispatchAnswerModal = useDispatch();
    const stockAnswerModalInStore = (data) => {
        dispatchAnswerModal(updateAnswerModal(data))
    }

    const dispatchMessage = useDispatch();
    const stockMessageInStore = (data) => {
        dispatchMessage(updateMessage(data))
    }
    
    if (answerModal.typeButton === 'confirm') {
        console.log(answerModal);
        console.log(stateSwitch)
        axios.put('http://127.0.0.1:8000/api/partner/' + answerModal.id + '/edit', {
            isActive: !stateSwitch
        })
        .then(response => {
                setStateSwitch(!stateSwitch);
                if (!stateSwitch) {
                    stockMessageInStore({type: 'success', content: 'Le partenaire ' + answerModal.id + ' - ' + answerModal.name + ' a bien été activé.'})
                } else {
                    stockMessageInStore({type: 'success', content: 'Le partenaire ' + answerModal.id + ' - ' + answerModal.name + ' a bien été désactivé.'})
                }
            })
            .catch(error => {
                if (!stateSwitch) {
                    stockMessageInStore({type: 'error', content: 'Le partenaire ' + answerModal.id + ' - ' + answerModal.name + ' n\'a pu être activé.'})
                } else {
                    stockMessageInStore({type: 'error', content: 'Le partenaire ' + answerModal.id + ' - ' + answerModal.name + ' n\'a pu être désactivé.'})
                }
            });
        stockAnswerModalInStore('');
    }

    return (
        <label id={id} className='toggleSwitch' onClick={(e) => clickSwitch(e, name)}>
            <input type="checkbox" id={id} name={type} onChange={e => handleChange(e)} checked={stateSwitch}/>
            <span></span>
        </label>
    )
}
