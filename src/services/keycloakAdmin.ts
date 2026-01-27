export interface KeycloakUser {
  id?: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  enabled: boolean;
  emailVerified?: boolean;
  credentials?: { type: string; value: string; temporary: boolean }[];
}

const getAdminToken = (): string => {
  const token = localStorage.getItem('kc_token');
  if (!token) {
    throw new Error('No authentication token available');
  }
  return token;
};

export const getUsers = async (): Promise<KeycloakUser[]> => {
  const token = getAdminToken();
  const response = await fetch('/api/admin/users', {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('kc_token');
      localStorage.removeItem('kc_refresh_token');
      throw new Error('Session expirée. Veuillez vous reconnecter.');
    }
    if (response.status === 403) {
      throw new Error('Accès refusé. Vérifiez que votre utilisateur a les rôles realm-management dans Keycloak.');
    }
    throw new Error(`Erreur lors du chargement des utilisateurs: ${response.status}`);
  }

  return response.json();
};

export const createUser = async (user: KeycloakUser): Promise<void> => {
  const token = getAdminToken();
  const response = await fetch('/api/admin/users', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create user: ${error}`);
  }
};

export const updateUser = async (userId: string, user: Partial<KeycloakUser>): Promise<void> => {
  const token = getAdminToken();
  const response = await fetch(`/api/admin/users/${userId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    throw new Error(`Failed to update user: ${response.status}`);
  }
};

export const deleteUser = async (userId: string): Promise<void> => {
  const token = getAdminToken();
  const response = await fetch(`/api/admin/users/${userId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to delete user: ${response.status}`);
  }
};

export const resetPassword = async (userId: string, password: string, temporary: boolean = true): Promise<void> => {
  const token = getAdminToken();
  const response = await fetch(`/api/admin/users/${userId}/reset-password`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type: 'password',
      value: password,
      temporary,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to reset password: ${response.status}`);
  }
};
