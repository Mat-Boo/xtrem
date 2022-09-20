import React, { useState } from 'react'

export default function Filters({ all, actives, inactives, searchFct, stateFct }) {

    const [state, setState] = useState();
    const [search, setSearch] = useState('');

    const handleChange = (e) => {
        setState(e.target.checked);
    }

    return (
        <div className='filters'>
            <form id="filterForm">
                <div className='formItem' id='searchBox'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="searchSvg" viewBox="0 0 16 16">
                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                    </svg>
                    <input type="text" id='search' name='search' placeholder='Rechercher' value={search} onChange={(e) => searchFct(e.target.value)}/>
                </div>
                <div className='stateBox'>
                    <div className='formItem' id='stateItem'>
                        <input type="radio" id='all' name='state' placeholder='Rechercher' onChange={e => handleChange(e)}/>
                        <label htmlFor="all">Tous ({all})</label>
                    </div>
                    <div className='formItem' id='stateItem'>
                        <input type="radio" id='actives' name='state' placeholder='Rechercher' onChange={e => handleChange(e)} />
                        <label htmlFor="actives">Actifs ({actives})</label>
                    </div>
                    <div className='formItem' id='stateItem'>
                        <input type="radio" id='inactives' name='state' placeholder='Rechercher' onChange={e => handleChange(e)} />
                        <label htmlFor="inactives">Inactifs ({inactives})</label>
                    </div>
                </div>
            </form>
        </div>
    )
}
