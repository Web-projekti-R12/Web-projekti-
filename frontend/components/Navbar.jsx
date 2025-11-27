import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // TÄRKEÄÄ: Tuo useNavigate

export default function Navbar() {
    // 1. Hookit
    const navigate = useNavigate();

    // 2. Tilan tarkistus: Tarkista, onko kirjautunut sisään
    const isAuthenticated = !!localStorage.getItem('authToken');

    // 3. Uloskirjautumistoiminto
    const handleLogout = () => {
        // Poista token
        localStorage.removeItem('authToken');
        
        // Ohjaa kirjautumissivulle
        navigate('/login');
    };

    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
                <a className="navbar-brand" href="#">MovieHub</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        
                        {/* 1. Julkiset linkit */}
                        <li className="nav-item">
                            <Link className='nav-link' to="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className='nav-link' to="/search">Search</Link>
                        </li>
                        
                        {/* 2. Ehdolliset linkit (Näkyy vain, jos kirjautunut) */}
                        {isAuthenticated && (
                            <>
                                <li className="nav-item">
                                    <Link className='nav-link' to="/groups">Groups</Link>
                                </li>
                            </>
                        )}
                        
                        {/* 3. Autentikaatiolinkit / Uloskirjautuminen */}
                        {isAuthenticated ? (
                            // Kirjautunut sisään: Näytä Kirjaudu ulos -nappi
                            <li className="nav-item">
                                <button 
                                    className='btn btn-outline-danger' // Käytä Bootstrap-luokkaa
                                    onClick={handleLogout}
                                >
                                    Kirjaudu ulos
                                </button>
                            </li>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link className='nav-link' to="/login">Login</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className='nav-link' to="/registration">Registration</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav >
    );
}