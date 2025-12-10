import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProfileSelector.css';

const API_URL = process.env.REACT_APP_API_URL || window.location.origin;

function ProfileSelector({ onSelectProfile }) {
  const [profiles, setProfiles] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found');
        setLoading(false);
        return;
      }
      
      const response = await axios.get(`${API_URL}/api/profiles`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfiles(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch profiles:', err);
      setError('Failed to load profiles');
      setLoading(false);
    }
  };

  const handleCreateProfile = async (e) => {
    e.preventDefault();
    if (!newProfileName.trim()) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Not authenticated');
        return;
      }
      
      const response = await axios.post(
        `${API_URL}/api/profiles`,
        { name: newProfileName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setProfiles([...profiles, response.data]);
      setNewProfileName('');
      setShowCreateForm(false);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create profile');
    }
  };

  const handleSelectProfile = async (profile) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Not authenticated');
        return;
      }
      
      await axios.put(
        `${API_URL}/api/profiles/${profile._id}`,
        { updateLastUsed: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onSelectProfile(profile);
    } catch (err) {
      console.error('Failed to update profile:', err);
      onSelectProfile(profile);
    }
  };

  const handleDeleteProfile = async (profileId, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this profile?')) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Not authenticated');
        return;
      }
      
      await axios.delete(`${API_URL}/api/profiles/${profileId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfiles(profiles.filter(p => p._id !== profileId));
    } catch (err) {
      setError('Failed to delete profile');
    }
  };

  if (loading) {
    return (
      <div className="profile-selector-container">
        <div className="profile-selector-card">
          <p>Loading profiles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-selector-container">
      <div className="profile-selector-card">
        <h1>Select Your Profile</h1>
        <p className="subtitle">Choose a save slot to continue</p>

        {error && <div className="error-message">{error}</div>}

        <div className="profiles-grid">
          {profiles.map((profile, index) => (
            <div
              key={profile._id}
              className="profile-card"
              onClick={() => handleSelectProfile(profile)}
            >
              <div className="profile-slot-number">Slot {index + 1}</div>
              <div className="profile-name">{profile.name}</div>
              <div className="profile-date">
                Last used: {new Date(profile.lastUsed).toLocaleDateString()}
              </div>
              <button
                className="delete-profile-btn"
                onClick={(e) => handleDeleteProfile(profile._id, e)}
                title="Delete profile"
              >
                ×
              </button>
            </div>
          ))}

          {!showCreateForm && profiles.length < 10 && (
            <div
              className="profile-card create-card"
              onClick={() => setShowCreateForm(true)}
            >
              <div className="create-icon">+</div>
              <div className="create-text">Create New Profile</div>
            </div>
          )}
        </div>

        {showCreateForm && (
          <form onSubmit={handleCreateProfile} className="create-profile-form">
            <input
              type="text"
              value={newProfileName}
              onChange={(e) => setNewProfileName(e.target.value)}
              placeholder="Enter profile name"
              maxLength={30}
              autoFocus
              className="profile-name-input"
            />
            <div className="form-buttons">
              <button type="submit" className="btn btn-primary">
                Create
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setShowCreateForm(false);
                  setNewProfileName('');
                  setError('');
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {profiles.length === 0 && !showCreateForm && (
          <div className="no-profiles">
            <p>No profiles yet. Create your first one to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfileSelector;
