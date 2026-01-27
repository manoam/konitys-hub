import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';

const Header: React.FC = () => {
  const { user, logout, hasRole } = useAuth();
  const location = useLocation();
  const isAdmin = hasRole('admin') || hasRole('realm-admin');

  // Debug: afficher les rôles dans la console
  console.log('User roles:', user?.roles);
  console.log('Is admin:', isAdmin);

  return (
    <header className="header">
      <div className="header-left">
        <Link to="/" className="logo-link">
          <h1 className="logo">KONITYS</h1>
          <span className="logo-subtitle">Platform Hub</span>
        </Link>
        <nav className="header-nav">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
            Applications
          </Link>
          {isAdmin && (
            <Link to="/admin/users" className={location.pathname === '/admin/users' ? 'active' : ''}>
              Utilisateurs
            </Link>
          )}
        </nav>
      </div>
      <div className="header-right">
        {user && (
          <>
            <div className="user-info">
              <span className="user-name">
                {user.firstName} {user.lastName}
              </span>
              <span className="user-email">{user.email}</span>
            </div>
            <button className="logout-btn" onClick={logout}>
              Deconnexion
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
