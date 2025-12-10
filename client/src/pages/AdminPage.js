import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminPage.css';
import BackButton from '../components/BackButton';

const API_URL = process.env.REACT_APP_API_URL || window.location.origin;

function AdminPage({ onBack }) {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [usersResponse, statsResponse] = await Promise.all([
        axios.get(`${API_URL}/api/admin/users`, { headers }),
        axios.get(`${API_URL}/api/admin/stats`, { headers })
      ]);

      setUsers(usersResponse.data);
      setStats(statsResponse.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
      setError(err.response?.data?.error || 'Failed to load admin data');
      setLoading(false);
    }
  };

  const handleToggleAdmin = async (userId) => {
    if (!window.confirm('Are you sure you want to toggle admin status for this user?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_URL}/api/admin/users/${userId}/toggle-admin`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Refresh data
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update user');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to DELETE this user and all their profiles? This cannot be undone!')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `${API_URL}/api/admin/users/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Refresh data
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete user');
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-container">
          <p>Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-page">
        <div className="admin-container">
          <div className="error-box">
            <h2>Access Denied</h2>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-container">
        <div style={{ marginBottom: '12px' }}>
          <BackButton onBack={onBack} />
        </div>
        <h1 className="admin-title">Admin Dashboard</h1>

        {/* Statistics Cards */}
        {stats && (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-value">{stats.totalUsers}</div>
              <div className="stat-label">Total Users</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🎮</div>
              <div className="stat-value">{stats.totalProfiles}</div>
              <div className="stat-label">Total Profiles</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⭐</div>
              <div className="stat-value">{stats.adminUsers}</div>
              <div className="stat-label">Admins</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📈</div>
              <div className="stat-value">{stats.recentUsers}</div>
              <div className="stat-label">New (7 days)</div>
            </div>
          </div>
        )}

        {/* Users Table */}
        <div className="users-section">
          <h2>All Users</h2>
          <div className="table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Avatar</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Profiles</th>
                  <th>Admin</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>
                      {user.picture && (
                        <img src={user.picture} alt={user.name} className="table-avatar" />
                      )}
                    </td>
                    <td className="user-name-cell">{user.name}</td>
                    <td>{user.email}</td>
                    <td className="center">{user.profileCount}</td>
                    <td className="center">
                      <span className={`badge ${user.isAdmin ? 'badge-admin' : 'badge-user'}`}>
                        {user.isAdmin ? 'Admin' : 'User'}
                      </span>
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="actions-cell">
                      <button
                        className="btn-small btn-warning"
                        onClick={() => handleToggleAdmin(user._id)}
                      >
                        {user.isAdmin ? 'Remove Admin' : 'Make Admin'}
                      </button>
                      <button
                        className="btn-small btn-danger"
                        onClick={() => handleDeleteUser(user._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
