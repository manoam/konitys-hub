import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apps } from '../config/apps';
import AppCard from './AppCard';
import { App } from '../types';
import './AppSwitcher.css';

const AppSwitcher: React.FC = () => {
  const navigate = useNavigate();
  const { hasRole } = useAuth();

  const handleAppClick = (app: App) => {
    if (app.externalUrl) {
      // Redirection vers une app externe (SSO gerera l'auth)
      window.location.href = app.externalUrl;
    } else {
      // Navigation interne (placeholder)
      navigate(app.path);
    }
  };

  const hasAccess = (app: App): boolean => {
    // Pour le moment, on autorise tout (pas de roles configures)
    // Plus tard: return app.roles.some(role => hasRole(role));
    return true;
  };

  return (
    <div className="app-switcher">
      <div className="app-switcher-header">
        <h2>Applications</h2>
        <p>Selectionnez une application pour commencer</p>
      </div>
      <div className="app-grid">
        {apps.map((app) => (
          <AppCard
            key={app.id}
            app={app}
            onClick={handleAppClick}
            disabled={!hasAccess(app)}
          />
        ))}
      </div>
    </div>
  );
};

export default AppSwitcher;
