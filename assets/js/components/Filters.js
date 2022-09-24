import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { updateFilter } from '../redux/redux';

export default function Filters({ all, actives, inactives, displayStates }) {

    const [stateAll, setStateAll] = useState(true);
    const [stateActives, setStateActives] = useState(false);
    const [stateInactives, setStateInactives] = useState(false);
    const [search, setSearch] = useState('');
    const filter = useSelector((state) => state.filter);
    
    const dispatchFilter = useDispatch();
    const stockFilterInStore = (data) => {
        dispatchFilter(updateFilter(data))
    }
    
    const handleChange = (e) => {
        switch (e.target.id) {
            case 'search':
                setSearch(e.target.value);
                stockFilterInStore({...filter, 'search': e.target.value});
                break;
            case 'all':
                setStateAll(e.target.checked);
                setStateActives(false);
                setStateInactives(false);
                stockFilterInStore({...filter, 'state': 'all'});
                break;
            case 'actives':
                setStateActives(e.target.checked);
                setStateAll(false);
                setStateInactives(false);
                stockFilterInStore({...filter, 'state': true});
                break;
            case 'inactives':
                setStateInactives(e.target.checked);
                setStateAll(false);
                setStateActives(false);
                stockFilterInStore({...filter, 'state': false});
            break;
        }
    }

    return (
        <div className='filters'>
            <form id="filterForm">
                <div className='formItem' id='searchBox'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="searchSvg" viewBox="0 0 16 16">
                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                    </svg>
                    <input type="text" id='search' name='search' placeholder='Rechercher' value={search} onChange={(e) => handleChange(e)}/>
                </div>
                {
                    displayStates &&
                        <div className='stateBox'>
                            <div className='formItem' id='stateItem'>
                                <input type="radio" id='all' name='state' onChange={e => handleChange(e)} checked={stateAll}/>
                                <label htmlFor="all">Tous ({all})</label>
                            </div>
                            <div className='formItem' id='stateItem'>
                                <input type="radio" id='actives' name='state' onChange={e => handleChange(e)} checked={stateActives}/>
                                <label htmlFor="actives">Actifs ({actives})</label>
                            </div>
                            <div className='formItem' id='stateItem'>
                                <input type="radio" id='inactives' name='state' onChange={e => handleChange(e)} checked={stateInactives}/>
                                <label htmlFor="inactives">Inactifs ({inactives})</label>
                            </div>
                        </div>
                }
            </form>
        </div>
    )
}
