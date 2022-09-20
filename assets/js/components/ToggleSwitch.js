import React, { useState } from 'react'

export default function ToggleSwitch({ id, type }) {

    const [stateSwitch, setStateSwitch] = useState(false);

    const handleChange = (e) => {
        setStateSwitch(e.target.value);
    }

    return (
        <label id={id} className='toggleSwitch'>
            <input type="checkbox" id={id} name={type} onChange={handleChange} value={stateSwitch} />
            <span></span>
        </label>
    )
}
