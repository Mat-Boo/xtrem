import React from 'react';
import SwitchToggle from './SwitchToggle';

export default function SwitchPermission({ isActive, id, name, clickSwitch, styleSwitch }) {
    return (
        <li className='switchPermission'>
            <SwitchToggle isActive={isActive} id={id} name={name} clickSwitch={clickSwitch} styleSwitch={styleSwitch}/>
            <span>{name}</span>
        </li>
    )
}
