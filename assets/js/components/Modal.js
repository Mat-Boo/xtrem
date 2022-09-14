import React from 'react';
import Button from './Button';

export default function Modal({ title, message, clickBtn, id }) {

    return (
        <>
            <div className="opacityBox"></div>
            <div className='modalConfirm'>
                <h6>{title}</h6>
                <p>{message}</p>
                <div className='actionBtns'>
                    <Button
                        type='cancel'
                        btnSvg='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
                            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
                            </svg>'
                        btnTitle='Annuler'
                        btnUrl=''
                        clickBtn={clickBtn}
                        id={id}
                    />
                    <Button
                        type='confirm'
                        btnSvg='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-check-lg" viewBox="0 0 16 16">
                            <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"/>
                            </svg>'
                        btnTitle='Confirmer'
                        btnUrl=''
                        clickBtn={clickBtn}
                        id={id}
                    />
                </div>
            </div>
        </>
    )
}
