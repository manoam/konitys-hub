import React from 'react';
import { App } from '../types';
import './AppCard.css';

interface AppCardProps {
  app: App;
  onClick: (app: App) => void;
  disabled?: boolean;
}

const AppCard: React.FC<AppCardProps> = ({ app, onClick, disabled = false }) => {
  return (
    <div
      className={`app-card ${disabled ? 'disabled' : ''}`}
      onClick={() => !disabled && onClick(app)}
      style={{ '--app-color': app.color } as React.CSSProperties}
    >
      <div className="app-icon">{app.icon}</div>
      <div className="app-info">
        <h3 className="app-name">{app.name}</h3>
        <p className="app-description">{app.description}</p>
      </div>
      {disabled && <span className="app-locked">🔒</span>}
    </div>
  );
};

export default AppCard;
