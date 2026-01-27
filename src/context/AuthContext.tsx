import { createContext, useContext, useState, useEffect, ReactNode, useRef, useCallback } from 'react';
import Keycloak from 'keycloak-js';
import keycloak from '../config/keycloak';
import { User } from '../types';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  keycloak: Keycloak;
  logout: () => void;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const isInitialized = useRef(false);

  const parseTokenAndSetUser = useCallback((tokenParsed: any) => {
    const realmRoles = tokenParsed.realm_access?.roles || [];
    const clientRoles = tokenParsed.resource_access?.['konitys-hub']?.roles || [];
    const allRoles = [...realmRoles, ...clientRoles];

    setUser({
      id: tokenParsed.sub || '',
      username: tokenParsed.preferred_username || '',
      email: tokenParsed.email || '',
      firstName: tokenParsed.given_name || '',
      lastName: tokenParsed.family_name || '',
      roles: allRoles,
    });
  }, []);

  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    // SSO: login-required redirige vers Keycloak si pas de session
    keycloak
      .init({
        onLoad: 'login-required',
        checkLoginIframe: false,
        pkceMethod: 'S256'
      })
      .then((authenticated: boolean) => {
        if (authenticated && keycloak.tokenParsed) {
          setIsAuthenticated(true);
          parseTokenAndSetUser(keycloak.tokenParsed);
          // Store token for admin API calls
          if (keycloak.token) {
            localStorage.setItem('kc_token', keycloak.token);
          }
          if (keycloak.refreshToken) {
            localStorage.setItem('kc_refresh_token', keycloak.refreshToken);
          }
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Keycloak init error:', error);
        setIsLoading(false);
      });

    // Token refresh automatique
    keycloak.onTokenExpired = () => {
      keycloak.updateToken(30).then(() => {
        // Update stored token after refresh
        if (keycloak.token) {
          localStorage.setItem('kc_token', keycloak.token);
        }
        if (keycloak.refreshToken) {
          localStorage.setItem('kc_refresh_token', keycloak.refreshToken);
        }
      }).catch(() => {
        localStorage.removeItem('kc_token');
        localStorage.removeItem('kc_refresh_token');
        keycloak.logout();
      });
    };
  }, [parseTokenAndSetUser]);

  const logout = () => {
    localStorage.removeItem('kc_token');
    localStorage.removeItem('kc_refresh_token');
    keycloak.logout({ redirectUri: window.location.origin });
  };

  const hasRole = (role: string): boolean => {
    return user?.roles.includes(role) || false;
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        keycloak,
        logout,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
