import React from 'react'

export default function ManageClubs() {

    const [partner, setPartner] = useState([]);
    const id = useParams().idSlug.substring(0, useParams().idSlug.indexOf('-', 0))

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/partner/' + id)
        .then((res) => {
            setPartner(res.data);
        })
    }, [])

    return (
        <div className='manageClubs'>
            <div className='header'>
                <Button 
                    type='back'
                    btnSvg='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-chevron-left" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
                        </svg>'
                    btnTitle='Retour'
                    btnUrl='/partenaires'
                />
            </div>
            <div className='partner'>
                <div className='logoAndInfos'>
                    <img src={'/uploads/' + partner.logo} alt='partner-logo' className='logo'/>
                    <div className='partnerInfos'>
                        <div>
                            <p className='id'>{partner.id}</p>
                            <p className='name'>{partner.name}</p>
                            <p className='description'>{partner.description}</p>
                        </div>
                        <ToggleSwitch
                            idPartner={partner.id}
                            idClub=''
                            idToggle={partner.id}
                            nameToggle={partner.name}
                            typeToggle='partner'
                            isActive={partner.isActive}/>
                    </div>
                </div>
            </div>
        </div>
    )
}
