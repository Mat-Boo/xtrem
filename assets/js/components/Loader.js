import React from 'react';
import loader from '../../../public/resources/loader.gif'

export default function Loader() {
    return (
        <img className='loader' src={loader} alt="loader" />
    )
}
