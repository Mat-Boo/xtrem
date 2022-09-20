import React, { useRef } from 'react';
import ToggleSwitch from './ToggleSwitch';

export default function SwitchPermission({ id, type, name }) {

    const toggleSwitchRef = useRef();
    

    const handleClick = () => {
        console.log(toggleSwitchRef);
        toggleSwitchRef.current.firstChild.click();
    }

    return (
        <li className='switchPermission'>
            <div ref={toggleSwitchRef}>
                <ToggleSwitch id={id} type={type}/>
            </div>
            <span onClick={handleClick}>{name}</span>
        </li>
    )
}
