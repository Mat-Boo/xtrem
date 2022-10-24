import React, { useState } from 'react';
import abdo from '../../img/sportCliparts/abdo.svg';
import corde from '../../img/sportCliparts/corde.svg';
import developpe from '../../img/sportCliparts/developpe.svg';
import fente from '../../img/sportCliparts/fente.svg';
import haltere from '../../img/sportCliparts/haltere.svg';
import ballon from '../../img/sportCliparts/ballon.svg';
import rameur from '../../img/sportCliparts/rameur.svg';
import squat from '../../img/sportCliparts/squat.svg';
import run from '../../img/sportCliparts/run.svg';
import traction from '../../img/sportCliparts/traction.svg';
import bike from '../../img/sportCliparts/bike.svg';
import line from '../../img/sportCliparts/line.svg';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';


export default function SportClipart() {

    const [randomClipart, setRandomClipart] = useState();
    const [sportCliparts, setSportCliparts] = useState([
        abdo, corde, developpe, fente, 
        haltere, haltere, ballon, rameur, squat, 
        run, traction, bike
    ])

    const location = useLocation();
    
    useEffect(() => {
        setRandomClipart(Math.floor(Math.random() * (10 - 0) + 0))
    }, [location.pathname])
    
    return (
        <div className='lineAndSportClipart'>
            <img src={line} alt="sportClipart" className='line'/>
            <img src={sportCliparts[randomClipart]} alt="sportClipart" className='sportClipart'/>
        </div>
    )
}
