import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import WhiteLogo from '../../img/logo-white.png';
import { useDispatch, useSelector } from 'react-redux';
import { updateAlertMessage } from '../redux/redux';
import { userServices } from '../_services/user_services';
import { checkToken } from '../_services/checkToken';

export default function Navbar() {

    const alertMessage = useSelector((state) => state.alertMessage);
    const dispatchAlertMessage = useDispatch();
    const stockAlertMessageInStore = (data) => {
        dispatchAlertMessage(updateAlertMessage(data))
    }

    const navigate = useNavigate();

    const [miniMenu, setMiniMenu] = useState(false);
    const menuRef = useRef();
    const accountRef = useRef();

    const [user, setUser] = useState();

    useEffect(() => {
        if (userServices.isConnected() & !checkToken.expired()) {
            setUser(userServices.getUser());
        } else {
            setUser(null);
        }
    }, [userServices.isConnected(), userServices.hasChangedTempPwd()])

    const displayMiniMenu = () => {
        setMiniMenu(true)
        menuRef.current.style.left = 0;
        menuRef.current.style.transition = 'left 500ms linear';
        accountRef.current.style.left = '50%';
        accountRef.current.style.transition = 'left 500ms linear';
    }

    const hideMiniMenu = (e) => {
        setMiniMenu(false)
        menuRef.current.style.left = '-100vw';
        accountRef.current.style.left = '-100vw';
        if (document.body.style.overflow === 'hidden' && e.target.id !== 'closeMiniMenu') {
            document.body.style.overflow = 'auto';
        }
    }

    const disconnect = () => {
        hideMiniMenu()
        userServices.logout()
        setUser(null);
        stockAlertMessageInStore({type: 'infos', content: 'Vous avez été déconnecté avec succès'});
        navigate('/');
    }

    return (
        <nav className='navbar'>
            <NavLink to={user && user.hasChangedTempPwd ? '/accueil' : (user && !user.hasChangedTempPwd ? '#' : '/')}>
                <img src={WhiteLogo} alt='logo' className='logoNav' onClick={user && user.hasChangedTempPwd ? (e) => hideMiniMenu(e) : null} />
            </NavLink>
            {
                user && user.hasChangedTempPwd &&
                <>
                    {!miniMenu ? <svg onClick={(e) => displayMiniMenu(e)} xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" className='miniMenuBtn' viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z" />
                    </svg> :
                        <svg onClick={(e) => hideMiniMenu(e)} id='closeMiniMenu' xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" className='closeMiniMenu' viewBox="0 0 16 16">
                            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                        </svg>
                    }
                    <ul ref={menuRef} className='menu'>
                        <li onClick={(e) => hideMiniMenu(e)} className='menuItem'>
                            <NavLink to='/accueil'>
                                ACCUEIL
                            </NavLink>
                        </li>
                        {
                            user.roles.includes('ROLE_TECHNICAL') &&
                            <>
                                <li onClick={(e) => hideMiniMenu(e)} className='menuItem'>
                                    <NavLink to='/partenaires'>
                                        PARTENAIRES
                                    </NavLink>
                                </li>
                                <li onClick={(e) => hideMiniMenu(e)} className='menuItem'>
                                    <NavLink to='/permissions'>
                                        PERMISSIONS
                                    </NavLink>
                                </li>
                            </>
                        }
                        {
                            user.roles.includes('ROLE_PARTNER') &&
                            <>
                                <li onClick={(e) => hideMiniMenu(e)} className='menuItem'>
                                    <NavLink to='/mes-clubs'>
                                        MES CLUBS
                                    </NavLink>
                                </li>
                            </>
                        }
                        {
                            user.roles.includes('ROLE_CLUB') &&
                            <>
                                <li onClick={(e) => hideMiniMenu(e)} className='menuItem'>
                                    <NavLink to='/mon-club'>
                                        MON CLUB
                                    </NavLink>
                                </li>
                            </>
                        }
                    </ul>
                    <div ref={accountRef} className='accountBox'>
                        <div className='accountBtnAndList'>
                            <div className='accountBtn'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="person" viewBox="0 0 16 16">
                                    <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                                </svg>
                                <span>{user.firstname}</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="chevron-down" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z" />
                                </svg>
                            </div>
                            <ul className='accountList'>
                                <NavLink to='/mon-compte'>
                                    <li className='accountListItem' onClick={() => hideMiniMenu()}>
                                            Mes informations
                                    </li>
                                </NavLink>
                                <li className='accountListItem' onClick={() => disconnect()}>
                                    Me déconnecter
                                </li>
                            </ul>
                        </div>
                    </div>
                </>
            }
        </nav>
    )
}
