import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import {
  getUsers,
  createUser,
  deleteUser,
  resetPassword,
  KeycloakUser,
} from '../services/keycloakAdmin';
import './UserManagement.css';

const UserManagement = () => {
  const { hasRole } = useAuth();
  const [users, setUsers] = useState<KeycloakUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    enabled: true,
  });
  const [newPassword, setNewPassword] = useState('');

  const isAdmin = hasRole('admin') || hasRole('realm-admin');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUser({
        username: formData.username,
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        enabled: formData.enabled,
        emailVerified: true,
        credentials: [
          {
            type: 'password',
            value: formData.password,
            temporary: true,
          },
        ],
      });
      setShowModal(false);
      setFormData({
        username: '',
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        enabled: true,
      });
      loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la creation');
    }
  };

  const handleDeleteUser = async (userId: string, username: string) => {
    if (!window.confirm(`Supprimer l'utilisateur ${username} ?`)) return;
    try {
      await deleteUser(userId);
      loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) return;
    try {
      await resetPassword(selectedUserId, newPassword, true);
      setShowPasswordModal(false);
      setNewPassword('');
      setSelectedUserId(null);
      alert('Mot de passe reinitialise. L\'utilisateur devra le changer a la prochaine connexion.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la reinitialisation');
    }
  };

  if (!isAdmin) {
    return (
      <div className="user-management">
        <Header />
        <div className="access-denied">
          <h2>Acces refuse</h2>
          <p>Vous n'avez pas les droits pour acceder a cette page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-management">
      <Header />
      <main className="main-content">
        <div className="page-header">
          <h1>Gestion des utilisateurs</h1>
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            + Nouvel utilisateur
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading">Chargement...</div>
        ) : (
          <table className="users-table">
            <thead>
              <tr>
                <th>Nom d'utilisateur</th>
                <th>Email</th>
                <th>Prenom</th>
                <th>Nom</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.firstName}</td>
                  <td>{user.lastName}</td>
                  <td>
                    <span className={`status ${user.enabled ? 'active' : 'inactive'}`}>
                      {user.enabled ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="actions">
                    <button
                      className="btn-small"
                      onClick={() => {
                        setSelectedUserId(user.id || null);
                        setShowPasswordModal(true);
                      }}
                    >
                      Mot de passe
                    </button>
                    <button
                      className="btn-small btn-danger"
                      onClick={() => user.id && handleDeleteUser(user.id, user.username)}
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>Nouvel utilisateur</h2>
              <form onSubmit={handleCreateUser}>
                <div className="form-group">
                  <label>Nom d'utilisateur</label>
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Prenom</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Nom</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Mot de passe temporaire</label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
                <div className="form-group checkbox">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.enabled}
                      onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                    />
                    Compte actif
                  </label>
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                    Annuler
                  </button>
                  <button type="submit" className="btn-primary">
                    Creer
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showPasswordModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>Reinitialiser le mot de passe</h2>
              <form onSubmit={handleResetPassword}>
                <div className="form-group">
                  <label>Nouveau mot de passe</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <p className="info-text">
                  L'utilisateur devra changer ce mot de passe a sa prochaine connexion.
                </p>
                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => {
                      setShowPasswordModal(false);
                      setNewPassword('');
                      setSelectedUserId(null);
                    }}
                  >
                    Annuler
                  </button>
                  <button type="submit" className="btn-primary">
                    Reinitialiser
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default UserManagement;
