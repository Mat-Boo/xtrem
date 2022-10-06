import React from 'react';
import slugify from 'react-slugify';
import Button from '../components/Button';
import { userServices } from '../_services/user_services';
import ToggleSwitch from './ToggleSwitch';

export default function PartnerCard({ id, logo, name, description, isActive, roles, nbClubs }) {
    return (
        <li className='partnerCard'>    
            <div className='logoAndInfos'>
                <img src={'/uploads/' + logo} alt='partner-logo' className='logo'/>
                <div className='partnerInfos'>
                    <div>
                        <p className='id'>{id}</p>
                        <p className='name'>{name}</p>
                        <p className='description'>{description}</p>
                    </div>
                    <ToggleSwitch
                        idPartner={id}
                        idClub=''
                        idToggle={id}
                        nameToggle={name}
                        typeToggle='partner'
                        isActive={isActive}
                        roles={roles}
                        isEnabled={true}
                    />
                </div>
            </div>
            <div className='actionBtns'>
                <Button
                    typeBtn='manageClubs'
                    btnSvg='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="manageSvg" viewBox="0 0 16 16">
                        <path d="M7 2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-1zM2 1a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2H2zm0 8a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2H2zm.854-3.646a.5.5 0 0 1-.708 0l-1-1a.5.5 0 1 1 .708-.708l.646.647 1.646-1.647a.5.5 0 1 1 .708.708l-2 2zm0 8a.5.5 0 0 1-.708 0l-1-1a.5.5 0 0 1 .708-.708l.646.647 1.646-1.647a.5.5 0 0 1 .708.708l-2 2zM7 10.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-1zm0-5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0 8a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"/>
                        </svg>'
                    btnTitle={'Gérer les clubs (' + nbClubs + ')'}
                    btnUrl={id + '-' + slugify(name) + '/clubs'}
                    isActive={true}
                />
                <Button
                    typeBtn='details'
                    btnSvg='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="detailsSvg" viewBox="0 0 16 16">
                        <path d="M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z"/>
                        <path d="M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5L9.5 0zm0 1v2A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z"/>
                        </svg>'
                    btnTitle='Détails'
                    btnUrl={id + '-' + slugify(name)}
                    isActive={true}
                />
            </div>
        </li>
    )
}