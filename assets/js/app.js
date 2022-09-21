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

/* const user = useSelector((state) => state.auth); */

ReactDOM.createRoot(document.getElementById('root')).render(
    <>
        <Router>
            <Provider store={store}>
                <Navbar /> 
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/accueil" element={<Home />} />
                    {/* {
                        user && user.roles.includes('ROLE_TECHNICAL') &&
                        <> */}
                            <Route path="/partenaires" element={<Partners />} />
                            <Route path="/partenaires/ajouter" element={<AddPartner />} />
                            <Route path="/partenaires/:idSlug" element={<ViewPartner />} />
                            <Route path="/permissions" element={<Permissions />} />
                            <Route path="/permissions/ajouter" element={<AddPermission />} />
                            <Route path="/permissions/:idSlug" element={<ViewPermission />} />
                            <Route path="/permissions/:idSlug/modifier" element={<EditPermission />} />
                  {/*       </>
                    } */}
                </Routes>
                <Footer />
            </Provider>
        </Router>
    </>

)