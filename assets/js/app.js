import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes,} from 'react-router-dom';
import '../styles/app.scss';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Partners from './pages/Partners/Partners';
import AddPartner from './pages/Partners/AddPartner';
import Permissions from './pages/Permissions/Permissions';
import Login from './pages/Login';
import { Provider/* , useSelector */ } from 'react-redux';
import { store } from './redux/redux';
import AddPermission from './pages/Permissions/AddPermission';
import ViewPermission from './pages/Permissions/ViewPermission';
import EditPermission from './pages/Permissions/EditPermission';
import ViewPartner from './pages/Partners/ViewPartner';
import EditPartner from './pages/Partners/EditPartner';
import Modal from './components/Modal';
import AlertMessage from './components/AlertMessage';
import ManageClubs from './pages/Partners/ManageClubs';
import AddClub from './pages/Clubs/AddClub';
import EditClub from './pages/Clubs/EditClub';
import MyAccount from './pages/MyAccount/MyAccount';
import EditAccount from './pages/MyAccount/EditAccount';
import ModifyPassword from './pages/MyAccount/ModifyPassword';

/* const user = useSelector((state) => state.auth); */

ReactDOM.createRoot(document.getElementById('root')).render(
    <>
        <Router>
            <Provider store={store}>
                <Navbar />
                <Modal />
                <AlertMessage />
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/accueil" element={<Home />} />
                    {/* {
                        user && user.roles.includes('ROLE_TECHNICAL') &&
                        <> */}
                            <Route path="/partenaires" element={<Partners />} />
                            <Route path="/partenaires/ajouter" element={<AddPartner />} />
                            <Route path="/partenaires/:idSlug" element={<ViewPartner />} />
                            <Route path="/partenaires/:idSlug/modifier" element={<EditPartner />} />
                            <Route path="/partenaires/:idSlug/clubs" element={<ManageClubs />} />
                            <Route path="/partenaires/:idSlug/clubs/ajouter" element={<AddClub />} />
                            <Route path="/partenaires/:idSlug/clubs/:idSlugClub/modifier" element={<EditClub />} />
                            <Route path="/permissions" element={<Permissions />} />
                            <Route path="/permissions/ajouter" element={<AddPermission />} />
                            <Route path="/permissions/:idSlug" element={<ViewPermission />} />
                            <Route path="/permissions/:idSlug/modifier" element={<EditPermission />} />
                            <Route path="/mon-compte/" element={<MyAccount />} />
                            <Route path="/mon-compte/modifier-mes-informations" element={<EditAccount />} />
                            <Route path="/mon-compte/modifier-mon-mot-de-passe" element={<ModifyPassword />} />
                  {/*       </>
                    } */}
                </Routes>
                <Footer />
            </Provider>
        </Router>
    </>

)