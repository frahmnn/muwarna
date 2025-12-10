import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

function Navbar({ onAdminClick }) {
  const { user, logout, isAuthenticated, selectedProfile, selectProfile } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSwitchProfile = () => {
    selectProfile(null);
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const handleAdminClick = () => {
    onAdminClick();
    setIsMenuOpen(false);
  };

  return (
    <>
      <button 
        className="menu-toggle"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Menu"
      >
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
      </button>

      {isMenuOpen && (
        <div className="menu-overlay" onClick={() => setIsMenuOpen(false)} />
      )}

      <nav className={`navbar-drawer ${isMenuOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <h2>Menu</h2>
          <button 
            className="close-btn"
            onClick={() => setIsMenuOpen(false)}
          >
            ✕
          </button>
        </div>
        
        <div className="drawer-content">
          {isAuthenticated ? (
            <div className="drawer-user">
              {selectedProfile && (
                <div className="drawer-profile-badge">
                  <span className="drawer-profile-label">Bermain sebagai:</span>
                  <span className="drawer-profile-name">{selectedProfile.name}</span>
                </div>
              )}
              <div className="drawer-user-info">
                {user.picture && (
                  <img 
                    src={user.picture} 
                    alt={user.name} 
                    className="drawer-user-avatar"
                  />
                )}
                <div className="drawer-user-details">
                  <span className="drawer-user-name">{user.name}</span>
                  {user.isAdmin && <span className="drawer-admin-badge">Admin</span>}
                </div>
              </div>
              
              <div className="drawer-buttons">
                {user.isAdmin && (
                  <button className="drawer-btn admin" onClick={handleAdminClick}>
                    🔧 Admin Panel
                  </button>
                )}
                {selectedProfile && (
                  <button className="drawer-btn switch" onClick={handleSwitchProfile}>
                    🔄 Ganti Profil
                  </button>
                )}
                <button className="drawer-btn logout" onClick={handleLogout}>
                  👋 Keluar
                </button>
              </div>
            </div>
          ) : (
            <div className="drawer-guest">
              <span className="drawer-guest-text">Belum login</span>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}

export default Navbar;
