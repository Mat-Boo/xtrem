import React, { useEffect, useRef, useState } from 'react';
import Button from './Button';
import ToggleSwitch from './ToggleSwitch';
import slugify from 'react-slugify';
import { userServices } from '../_services/user_services';

export default function ClubCard({ partner, id, name, logo, isActive, address, zipcode, city, idManager, firstname, lastname, phone, email, permissions, roles, partnerState }) {

    const permissionsFieldsetRef = useRef();
    const chevronDownRef = useRef();
    const [displayedPermissions, setDisplayedPermissions] = useState(false);
    const displayPermissions = () => {
        if (!displayedPermissions) {
            setDisplayedPermissions(true);
            permissionsFieldsetRef.current.style.transition = 'background-color 500ms ease-in, max-height 1500ms ease-in';
            permissionsFieldsetRef.current.style.backgroundColor = '#BECEE1';
            permissionsFieldsetRef.current.style.border = '1px solid #3F72AE';
            permissionsFieldsetRef.current.style.maxHeight = '5000px';
            chevronDownRef.current.style.transform = 'rotate(-180deg)';
            setTimeout(() => {
                permissionsFieldsetRef.current.style.maxHeight = (permissionsFieldsetRef.current.clientHeight) * 2  + 'px';
            }, 500);
        } else {
            setDisplayedPermissions(false);
            permissionsFieldsetRef.current.style.transition = 'background-color 500ms ease-in, max-height 500ms ease-in';
            permissionsFieldsetRef.current.style.background = 'none';
            permissionsFieldsetRef.current.style.maxHeight = 0;
            chevronDownRef.current.style.transform = 'rotate(0)';
            setTimeout(() => {
                permissionsFieldsetRef.current.style.border = 'none';
            }, 400);
        }
    }

    return (
        <li className='clubCard'>
            <div className='clubInfosAndManagerAndBtns'>
                <div className='logoAndInfos'>
                    <img src={'/uploads/' + logo} alt='club-logo' className='logo'/>
                    <div className='clubInfos'>
                        <div>
                            <p className='id'>{id}</p>
                            <p className='name'>{name}</p>
                            <div className="addressInfos">
                                <p className='address'>{address}</p>
                                <p className='zipAndCity'>{zipcode} <b>{city.toUpperCase()}</b></p>
                            </div>
                        </div>
                        <ToggleSwitch
                            idClub={id}
                            idToggle={id}
                            nameToggle={name}
                            typeToggle='club'
                            isActive={isActive}
                            roles={roles}
                            isEnabled={partnerState}
                        />
                    </div>
                </div>
                <hr />
                <div className="managerInfos">
                    <p className='name'>{firstname} {lastname}</p>
                    <p className='phone'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-telephone" viewBox="0 0 16 16">
                            <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.678.678 0 0 0-.122-.58L3.654 1.328zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z"/>
                        </svg>
                        <a href={"tel:" + phone} className='telCom'>{phone}</a>
                    </p>
                    <p className='email'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-envelope" viewBox="0 0 16 16">
                            <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z"/>
                        </svg>
                        <a href={"mailto:" + email} className='emailCom'>{email}</a>
                    </p>
                </div>
                <hr />
                {
                    roles.includes('ROLE_TECHNICAL') &&
                        <div className="actionBtns">
                            <Button
                                typeBtn='modify'
                                btnSvg='<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16">
                                    <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                                    </svg>'
                                btnTitle='Modifier'
                                btnUrl={id + '-' + slugify(name) + '/modifier'}
                                isActive={partnerState}
                            />
                            <Button
                                idItem={idManager}
                                nameItem={name}
                                typeItem={'club'}
                                nameUser={firstname + ' ' + lastname}
                                typeBtn='resetAccess'
                                btnSvg='<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-key" viewBox="0 0 16 16">
                                    <path d="M0 8a4 4 0 0 1 7.465-2H14a.5.5 0 0 1 .354.146l1.5 1.5a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0L13 9.207l-.646.647a.5.5 0 0 1-.708 0L11 9.207l-.646.647a.5.5 0 0 1-.708 0L9 9.207l-.646.647A.5.5 0 0 1 8 10h-.535A4 4 0 0 1 0 8zm4-3a3 3 0 1 0 2.712 4.285A.5.5 0 0 1 7.163 9h.63l.853-.854a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.793-.793-1-1h-6.63a.5.5 0 0 1-.451-.285A3 3 0 0 0 4 5z"/>
                                    <path d="M4 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                                    </svg>'
                                btnTitle='Réinitialiser accès Manager'
                                btnUrl=''
                                isActive={partnerState}
                            />
                            <Button
                                idItem={id}
                                nameItem={name}
                                typeItem={'club'}
                                typeBtn='delete'
                                btnSvg='<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                    <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                                    </svg>'
                                btnTitle='Supprimer'
                                btnUrl=''
                                isActive={partnerState}
                            />
                        </div>
                }
            </div>
            {
                (!isActive & partnerState & userServices.getUser().roles.includes('ROLE_TECHNICAL')) ?
                    <p className='messageActivateClub'>Le club doit être activé pour pouvoir gérer ses permissions.</p> : ''
            }
            <form>
                <fieldset id='permissionsFieldset' ref={permissionsFieldsetRef}>
                    <legend onClick={displayPermissions}>
                        <span>Permissions</span>
                        <svg ref={chevronDownRef} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="chevron-down" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
                        </svg>
                    </legend>
                    <ul className='permissionsList'>
                        {
                            permissions
                                .sort((a, b) => (a.PartnerPermissions.Permission.id - b.PartnerPermissions.Permission.id))
                                .map((permission) => (
                                    <li  key={permission.id} className='switchPermission'>
                                        <div>
                                            <ToggleSwitch
                                                idPartner={partner.id}
                                                idClub={id}
                                                nameClub={name}
                                                idToggle={permission.PartnerPermissions.id}
                                                nameToggle={permission.PartnerPermissions.Permission.name}
                                                typeToggle='permission'
                                                isActive={permission.isActive}
                                                roles={roles}
                                                isEnabled={isActive}
                                            />
                                        </div>
                                        <span className='permissionName'>{permission.PartnerPermissions.Permission.name}</span>
                                    </li>
                            ))
                        }
                    </ul>
                </fieldset>
            </form>
        </li>
    )
}
