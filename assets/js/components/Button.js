import React from 'react';
import { NavLink } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { useDispatch } from 'react-redux';
import { updateTypeButton } from '../redux/redux';

export default function Button({ type, btnSvg, btnTitle, btnUrl}) {

    const dispatchTypeButton = useDispatch();
    const stockTypeButtonInStore = (data) => {
        dispatchTypeButton(updateTypeButton(data))
    }

    const onClick = () => {
        stockTypeButtonInStore(type);
    }

    return (
        <div className='button' id={type} onClick={onClick}>
            <NavLink to={btnUrl ? btnUrl : '#'}>
                <div className='contentSvg' dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(btnSvg)}}/>
                <span>{btnTitle}</span>
            </NavLink>
        </div>
    )
}