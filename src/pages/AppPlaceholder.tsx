import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apps } from '../config/apps';
import Header from '../components/Header';
import './AppPlaceholder.css';

const AppPlaceholder: React.FC = () => {
  const { appId } = useParams<{ appId: string }>();
  const navigate = useNavigate();
  const app = apps.find((a) => a.id === appId);

  if (!app) {
    return (
      <div className="app-placeholder">
        <Header />
        <div className="placeholder-content">
          <h2>Application non trouvée</h2>
          <button onClick={() => navigate('/')}>Retour au Hub</button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-placeholder">
      <Header />
      <div className="placeholder-content">
        <div className="placeholder-icon" style={{ background: app.color }}>
          {app.icon}
        </div>
        <h2>{app.name}</h2>
        <p>{app.description}</p>
        <div className="placeholder-status">
          <span className="status-badge">En développement</span>
        </div>
        <button className="back-btn" onClick={() => navigate('/')}>
          ← Retour au Hub
        </button>
      </div>
    </div>
  );
};

export default AppPlaceholder;
