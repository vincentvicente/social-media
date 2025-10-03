import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import LogoutHandler from './LogoutHandler';
import '../styling/NavBar.css';

const NavBar = ({ isLoggedIn, username, onLogout }) => {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">🌐</span>
          <h1>Social Hub</h1>
        </Link>
        <div className="navbar-links">
          <Link to="/" className={`nav-link ${isActive('/')}`}>
            <span className="nav-icon">🏠</span>
            <span>Home</span>
          </Link>
          <Link to="/user" className={`nav-link ${isActive('/user')}`}>
            <span className="nav-icon">👤</span>
            <span>Profile</span>
          </Link>
          {isLoggedIn && username ? (
            <>
              <div className="user-badge">
                <div className="user-avatar-small">
                  {username[0].toUpperCase()}
                </div>
                <span className="username-display">{username}</span>
              </div>
              <LogoutHandler onLogout={onLogout} />
            </>
          ) : (
            <>
              <Link to="/login" className={`nav-link auth-link ${isActive('/login')}`}>
                Login
              </Link>
              <Link to="/register" className={`nav-link auth-link signup ${isActive('/register')}`}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
