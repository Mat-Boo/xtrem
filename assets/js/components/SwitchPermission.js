import React, { useRef } from 'react';
import ToggleSwitch from './ToggleSwitch';

export default function SwitchPermission({ id, type, name, checked }) {

    const toggleSwitchRef = useRef();
    // Fonction permettant de cliquer sur le nom associé au toggle et ainsi l'activer ou le désactiver
    const handleClick = () => {
        toggleSwitchRef.current.firstChild.click();
    }

    return (
        <li className='switchPermission'>
            <div ref={toggleSwitchRef}>
                <ToggleSwitch id={id} type={type} name={name} checked={checked}/>
            </div>
            <span onClick={handleClick}>{name}</span>
        </li>
    )
}
