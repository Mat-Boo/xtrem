import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes,} from 'react-router-dom';
import '../styles/app.scss';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Partners from './pages/Partners/Partners';
import AddPartner from './pages/Partners/AddPartner';
import Permissions from './pages/Permissions';
import Login from './pages/Login';
import { Provider/* , useSelector */ } from 'react-redux';
import { store } from './redux/redux';

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
                            <Route path="/permissions" element={<Permissions />} />
                  {/*       </>
                    } */}
                </Routes>
                <Footer />
            </Provider>
        </Router>
    </>

)