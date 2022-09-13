 import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes,} from 'react-router-dom';
import '../styles/app.scss';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Users from './pages/Users';
import Footer from './components/Footer';
import Partners from './pages/Partners';
import Permissions from './pages/Permissions';

ReactDOM.createRoot(document.getElementById('root')).render(
    <>
        <Router>
            <Navbar /> 
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/users" element={<Users />} />
                <Route path="/partenaires" element={<Partners />} />
                <Route path="/permissions" element={<Permissions />} />
            </Routes>
            <Footer />
        </Router>
    </>

)