import React, { useState } from 'react'

export default function ToggleSwitch({ id, type, name, clickSwitch, checked }) {

    const [stateSwitch, setStateSwitch] = useState(checked);
    const handleChange = (e) => {
        setStateSwitch(e.target.checked);
    }
    
    

    return (
        <label id={id} className='toggleSwitch' onClick={clickSwitch ? (e) => clickSwitch(e, name) : null}>
            <input type="checkbox" id={id} name={type} onChange={e => handleChange(e)} checked={stateSwitch}/>
            <span></span>
        </label>
    )
}
