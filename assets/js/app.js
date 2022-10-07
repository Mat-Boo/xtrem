import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import '../styles/app.scss';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Partners from './pages/Technical/Partners/Partners';
import AddPartner from './pages/Technical/Partners/AddPartner';
import Permissions from './pages/Technical/Permissions/Permissions';
import Login from './pages/Login';
import { Provider } from 'react-redux';
import { store } from './redux/redux';
import AddPermission from './pages/Technical/Permissions/AddPermission';
import ViewPermission from './pages/Technical/Permissions/ViewPermission';
import EditPermission from './pages/Technical/Permissions/EditPermission';
import ViewPartner from './pages/Technical/Partners/ViewPartner';
import EditPartner from './pages/Technical/Partners/EditPartner';
import Modal from './components/Modal';
import AlertMessage from './components/AlertMessage';
import ManageClubs from './pages/Technical/Clubs/ManageClubs';
import AddClub from './pages/Technical/Clubs/AddClub';
import EditClub from './pages/Technical/Clubs/EditClub';
import MyAccount from './pages/MyAccount/MyAccount';
import EditAccount from './pages/MyAccount/EditAccount';
import ModifyPassword from './pages/MyAccount/ModifyPassword';
import PrivateRoutes from './PrivatesRoutes/PrivateRoutes';
import PrivateTechnicalRoutes from './PrivatesRoutes/PrivateTechnicalRoutes';
import PrivatePartnerRoutes from './PrivatesRoutes/PrivatePartnerRoutes';
import PrivateClubRoutes from './PrivatesRoutes/PrivateClubRoutes';
import PrivateChangeTempPwdRoutes from './PrivatesRoutes/PrivateChangeTempPwdRoutes';
import MyClubs from './pages/Partner/MyClubs';
import MyClub from './pages/Club/MyClub';
import ResetPasswordPartner from './pages/Technical/Partners/ResetPassword';
import ResetPasswordClub from './pages/Technical/Clubs/ResetPassword';
import E404 from './pages/E404';
import ChangeTempPwd from './pages/ChangeTempPwd';

ReactDOM.createRoot(document.getElementById('root')).render(
    <>
        <Router>
            <Provider store={store}>
                <Navbar />
                <Modal />
                <AlertMessage />
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route element={<PrivateChangeTempPwdRoutes />}>
                        <Route path="/creation-mot-de-passe" element={<ChangeTempPwd />} />
                    </Route>
                    <Route element={<PrivateRoutes />}>
                        <Route path="/accueil" element={<Home />} />
                        <Route path="/mon-compte/" element={<MyAccount />} />
                        <Route path="/mon-compte/modifier-mes-informations" element={<EditAccount />} />
                        <Route path="/mon-compte/modifier-mon-mot-de-passe" element={<ModifyPassword />} />
                        <Route element={<PrivateTechnicalRoutes />}>
                            <Route path="/partenaires" element={<Partners />} />
                            <Route path="/partenaires/ajouter" element={<AddPartner />} />
                            <Route path="/partenaires/:idSlug" element={<ViewPartner />} />
                            <Route path="/partenaires/:idSlug/modifier" element={<EditPartner />} />
                            <Route path="/partenaires/:idSlug/reinitialiser-mot-de-passe" element={<ResetPasswordPartner />} />
                            <Route path="/partenaires/:idSlug/clubs" element={<ManageClubs />} />
                            <Route path="/partenaires/:idSlug/clubs/ajouter" element={<AddClub />} />
                            <Route path="/partenaires/:idSlug/clubs/:idSlugClub/modifier" element={<EditClub />} />
                            <Route path="/partenaires/:idSlug/clubs/:idSlugClub/reinitialiser-mot-de-passe" element={<ResetPasswordClub />} />
                            <Route path="/permissions" element={<Permissions />} />
                            <Route path="/permissions/ajouter" element={<AddPermission />} />
                            <Route path="/permissions/:idSlug" element={<ViewPermission />} />
                            <Route path="/permissions/:idSlug/modifier" element={<EditPermission />} />
                        </Route>
                        <Route element={<PrivatePartnerRoutes />}>
                            <Route path="/mes-clubs/" element={<MyClubs />} />
                        </Route>
                        <Route element={<PrivateClubRoutes />}>
                            <Route path="/mon-club/" element={<MyClub />} />
                        </Route>
                    </Route>
                    <Route path="*" element={<E404 />} />
                </Routes>
                <Footer />
            </Provider>
        </Router>
    </>

)