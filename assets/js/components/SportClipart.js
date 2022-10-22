import React, { useState } from 'react';
import abdos from '../../img/sportCliparts/abdos.svg';
import cordeSauter from '../../img/sportCliparts/cordeSauter.svg';
import developpeCouche from '../../img/sportCliparts/developpeCouche.svg';
import fentes from '../../img/sportCliparts/fentes.svg';
import halteres from '../../img/sportCliparts/halteres.svg';
import ballon from '../../img/sportCliparts/ballon.svg';
import rameur from '../../img/sportCliparts/rameur.svg';
import squats from '../../img/sportCliparts/squats.svg';
import run from '../../img/sportCliparts/run.svg';
import traction from '../../img/sportCliparts/traction.svg';
import velo from '../../img/sportCliparts/velo.svg';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';


export default function SportClipart() {

    const [randomClipart, setRandomClipart] = useState();
    const [sportCliparts, setSportCliparts] = useState([
        abdos, cordeSauter, developpeCouche, fentes, 
        halteres, halteres, ballon, rameur, squats, 
        run, traction, velo
    ])

    const location = useLocation();
    
    useEffect(() => {
        setRandomClipart(Math.floor(Math.random() * (10 - 0) + 0))

    }, [location.pathname])
    
    return (
        <img src={sportCliparts[randomClipart]} alt="sportClipart" className='sportClipart'/>
    )
}
