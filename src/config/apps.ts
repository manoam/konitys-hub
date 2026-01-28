import { App } from '../types';

// URLs des applications externes (configurables via variables d'environnement)
const APP_URLS = {
  booth: process.env.REACT_APP_BOOTH_URL || 'https://konitys-booth-production.up.railway.app',
  antenne: process.env.REACT_APP_ANTENNE_URL || 'https://konitys-antenne-production.up.railway.app',
  admin: process.env.REACT_APP_ADMIN_URL || 'https://konitys-admin-production.up.railway.app',
};

export const apps: App[] = [
  {
    id: 'events',
    name: 'Events',
    description: 'Gestion des evenements',
    icon: '??',
    path: '/apps/events',
    roles: ['events.read'],
    color: '#4F46E5',
  },
  {
    id: 'booth',
    name: 'Booth',
    description: 'Configuration des bornes, downloads, retry',
    icon: '???',
    path: '/apps/booth',
    roles: ['booth.read'],
    color: '#059669',
    externalUrl: APP_URLS.booth,
  },
  {
    id: 'stocks',
    name: 'Stocks',
    description: 'Gestion des stocks',
    icon: '??',
    path: '/apps/stocks',
    roles: ['stocks.read'],
    color: '#D97706',
  },
  {
    id: 'subscriptions',
    name: 'Abonnements',
    description: 'Gestion des abonnements',
    icon: '??',
    path: '/apps/subscriptions',
    roles: ['subscriptions.read'],
    color: '#DC2626',
  },
  {
    id: 'support',
    name: 'Support',
    description: 'Support & Knowledge base',
    icon: '??',
    path: '/apps/support',
    roles: ['support.read'],
    color: '#7C3AED',
  },
  {
    id: 'antenne',
    name: 'Antenne',
    description: 'Gestion des antennes',
    icon: '??',
    path: '/apps/antenne',
    roles: ['antenne.read'],
    color: '#0891B2',
    externalUrl: APP_URLS.antenne,
  },
  {
    id: 'admin',
    name: 'Admin',
    description: 'Administration du systeme',
    icon: '??',
    path: '/apps/admin',
    roles: ['admin'],
    color: '#374151',
    externalUrl: APP_URLS.admin,
  },
];
