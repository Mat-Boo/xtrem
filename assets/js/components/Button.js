import React from 'react';
import { NavLink } from 'react-router-dom';
import DOMPurify from 'dompurify';

export default function Button({ type, btnSvg, btnTitle, btnUrl, clickBtn}) {
    return (
        <div className='button' id={type} onClick={type === 'confirm' || type === 'cancel' || type === 'validate' || type === 'delete' ? () => clickBtn(type) : null}>
            <NavLink to={btnUrl}>
                <div className='contentSvg' dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(btnSvg)}}/>
                <span>{btnTitle}</span>
            </NavLink>
        </div>
    )
}