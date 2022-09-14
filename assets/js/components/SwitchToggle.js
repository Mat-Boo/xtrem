import React, { useEffect, useState } from 'react';

export default function SwitchToggle({ isActive, id, name, clickSwitch, styleSwitch } ) {  
    return (
        <div onClick={() => clickSwitch(name)} className='toggleBg' id={'switch' + id}
            style={
                {
                    background: styleSwitch.id === id ? styleSwitch.background : (isActive ? '#3F72AE' : '#ECACAC'),
                    justifyContent: styleSwitch.id === id ? styleSwitch.justifyContent : (isActive ? 'flex-end' : 'flex-start')
                }
            }>
            <div className='toggleCircle'></div>
        </div>
    )
}
