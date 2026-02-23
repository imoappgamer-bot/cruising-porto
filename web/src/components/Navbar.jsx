import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar({ user, onLogout }) {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">📍</span>
          <span className="brand-text">Cruising Porto</span>
        </Link>

        <div className="navbar-menu">
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            <span className="nav-icon">🗺️</span>
            Mapa
          </Link>
          
          <Link 
            to="/profile" 
            className={`nav-link ${location.pathname === '/profile' ? 'active' : ''}`}
          >
            <span className="nav-icon">👤</span>
            Perfil
          </Link>

          <button onClick={onLogout} className="nav-link logout-btn">
            <span className="nav-icon">🚪</span>
            Sair
          </button>
        </div>

        <div className="user-info">
          <span className="username">{user.username}</span>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
