import React from 'react';
import { useEffect } from 'react';
import { userServices } from '../_services/user_services';
import { checkToken } from '../_services/checkToken';
import { useNavigate } from 'react-router-dom';
import abdos from '../../img/svgBg/abdos.svg';

export default function Home() {

    const navigate = useNavigate();

    useEffect(() => {
        if (checkToken.expired()) {
            navigate('/');
        }
        document.title = 'Accueil | Xtrem';
    })

    return (
        <div className='home'>
            {
                userServices.getUser().roles.includes('ROLE_TECHNICAL') &&
                <>
                    <div className="header">
                        <h1>Bienvenue sur l'interface de l'équipe technique</h1>
                    </div>
                    <div className='homeContent'>
                        <p>Consectetur sunt labore eu elit sint occaecat ut anim ullamco. Sit et sunt sit et et. Minim incididunt sint pariatur dolore minim ipsum sunt mollit nostrud commodo dolore. Enim id ex sit irure ea nisi reprehenderit nulla commodo sint incididunt aliquip aliqua magna. Excepteur occaecat eiusmod occaecat laboris ipsum sint nulla aliquip in ex dolor. Proident ea Lorem sunt officia aliquip cupidatat ut.</p>
                        <p>Est mollit excepteur deserunt qui deserunt tempor magna nostrud cillum excepteur. Et anim minim veniam fugiat cupidatat in dolore cupidatat eu excepteur aute labore ad officia. Amet consequat dolor elit reprehenderit amet reprehenderit sit eiusmod ex labore mollit velit cupidatat. Et laboris mollit enim voluptate Lorem adipisicing non fugiat consectetur nisi elit cillum. Voluptate aute sint et occaecat aliqua dolore tempor ex amet fugiat aute sit labore in.</p>
                        <p>Dolore est qui elit enim nisi ad ad id ea ex nulla ut. Nulla incididunt cupidatat non sunt. Sint dolor elit labore velit Lorem velit proident ullamco. Sint occaecat deserunt amet nulla qui officia aute reprehenderit nisi aliqua esse eiusmod ut. Sit excepteur consectetur officia sit. Anim exercitation dolor magna excepteur adipisicing deserunt culpa duis.</p>
                        <p>Eiusmod sunt consectetur eu irure. Fugiat sint aute nulla in qui ea proident. Minim consequat est consectetur anim sit irure excepteur. Duis et nostrud mollit ullamco tempor eu labore sunt excepteur irure est exercitation irure.</p>
                        <p>Laboris et et do commodo consequat exercitation ad minim irure. Aute anim mollit proident id anim id. Voluptate in enim reprehenderit eu tempor exercitation est elit quis sunt. Excepteur labore magna cillum consectetur elit magna magna. Aliquip proident pariatur sit exercitation eiusmod nulla ad eiusmod proident est. Reprehenderit elit enim labore fugiat.</p>
                    </div>
                </>
            }
            {
                userServices.getUser().roles.includes('ROLE_PARTNER') &&
                <>
                    <div className="header">
                        <h1>Bienvenue sur l'interface des partenaires</h1>
                    </div>
                    <div className='homeContent'>
                        <p>Consectetur sunt labore eu elit sint occaecat ut anim ullamco. Sit et sunt sit et et. Minim incididunt sint pariatur dolore minim ipsum sunt mollit nostrud commodo dolore. Enim id ex sit irure ea nisi reprehenderit nulla commodo sint incididunt aliquip aliqua magna. Excepteur occaecat eiusmod occaecat laboris ipsum sint nulla aliquip in ex dolor. Proident ea Lorem sunt officia aliquip cupidatat ut.</p>
                        <p>Est mollit excepteur deserunt qui deserunt tempor magna nostrud cillum excepteur. Et anim minim veniam fugiat cupidatat in dolore cupidatat eu excepteur aute labore ad officia. Amet consequat dolor elit reprehenderit amet reprehenderit sit eiusmod ex labore mollit velit cupidatat. Et laboris mollit enim voluptate Lorem adipisicing non fugiat consectetur nisi elit cillum. Voluptate aute sint et occaecat aliqua dolore tempor ex amet fugiat aute sit labore in.</p>
                        <p>Dolore est qui elit enim nisi ad ad id ea ex nulla ut. Nulla incididunt cupidatat non sunt. Sint dolor elit labore velit Lorem velit proident ullamco. Sint occaecat deserunt amet nulla qui officia aute reprehenderit nisi aliqua esse eiusmod ut. Sit excepteur consectetur officia sit. Anim exercitation dolor magna excepteur adipisicing deserunt culpa duis.</p>
                        <p>Eiusmod sunt consectetur eu irure. Fugiat sint aute nulla in qui ea proident. Minim consequat est consectetur anim sit irure excepteur. Duis et nostrud mollit ullamco tempor eu labore sunt excepteur irure est exercitation irure.</p>
                        <p>Laboris et et do commodo consequat exercitation ad minim irure. Aute anim mollit proident id anim id. Voluptate in enim reprehenderit eu tempor exercitation est elit quis sunt. Excepteur labore magna cillum consectetur elit magna magna. Aliquip proident pariatur sit exercitation eiusmod nulla ad eiusmod proident est. Reprehenderit elit enim labore fugiat.</p>
                    </div>
                </>
            }
            {
                userServices.getUser().roles.includes('ROLE_CLUB') &&
                <>
                    <div className="header">
                        <h1>Bienvenue sur l'interface des clubs</h1>
                    </div>
                    <div className='homeContent'>
                        <p>Consectetur sunt labore eu elit sint occaecat ut anim ullamco. Sit et sunt sit et et. Minim incididunt sint pariatur dolore minim ipsum sunt mollit nostrud commodo dolore. Enim id ex sit irure ea nisi reprehenderit nulla commodo sint incididunt aliquip aliqua magna. Excepteur occaecat eiusmod occaecat laboris ipsum sint nulla aliquip in ex dolor. Proident ea Lorem sunt officia aliquip cupidatat ut.</p>
                        <p>Est mollit excepteur deserunt qui deserunt tempor magna nostrud cillum excepteur. Et anim minim veniam fugiat cupidatat in dolore cupidatat eu excepteur aute labore ad officia. Amet consequat dolor elit reprehenderit amet reprehenderit sit eiusmod ex labore mollit velit cupidatat. Et laboris mollit enim voluptate Lorem adipisicing non fugiat consectetur nisi elit cillum. Voluptate aute sint et occaecat aliqua dolore tempor ex amet fugiat aute sit labore in.</p>
                        <p>Dolore est qui elit enim nisi ad ad id ea ex nulla ut. Nulla incididunt cupidatat non sunt. Sint dolor elit labore velit Lorem velit proident ullamco. Sint occaecat deserunt amet nulla qui officia aute reprehenderit nisi aliqua esse eiusmod ut. Sit excepteur consectetur officia sit. Anim exercitation dolor magna excepteur adipisicing deserunt culpa duis.</p>
                        <p>Eiusmod sunt consectetur eu irure. Fugiat sint aute nulla in qui ea proident. Minim consequat est consectetur anim sit irure excepteur. Duis et nostrud mollit ullamco tempor eu labore sunt excepteur irure est exercitation irure.</p>
                        <p>Laboris et et do commodo consequat exercitation ad minim irure. Aute anim mollit proident id anim id. Voluptate in enim reprehenderit eu tempor exercitation est elit quis sunt. Excepteur labore magna cillum consectetur elit magna magna. Aliquip proident pariatur sit exercitation eiusmod nulla ad eiusmod proident est. Reprehenderit elit enim labore fugiat.</p>
                    </div>
                </>
            }
            <img src={abdos} alt="abdos" className='abdos'/>
        </div>
    )
}
