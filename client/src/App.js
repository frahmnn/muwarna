import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import AdminPage from './pages/AdminPage';
import ColorPage from './pages/ColorPage';
import MiniGame from './pages/MiniGame';
import Login from './components/Login';
import Navbar from './components/Navbar';
import ProfileSelector from './components/ProfileSelector';
import './App.css';

function AppContent() {
  const { isAuthenticated, loading, selectedProfile, selectProfile, user } = useAuth();
  const [showAdminPage, setShowAdminPage] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);

  if (loading) {
    return (
      <div className="App">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          fontSize: '1.5rem'
        }}>
          Loading...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="App">
        <Login />
      </div>
    );
  }

  if (!selectedProfile && !showAdminPage) {
    return (
      <div className="App">
        <ProfileSelector onSelectProfile={selectProfile} />
      </div>
    );
  }

  if (showAdminPage && user?.isAdmin) {
    return (
      <div className="App">
        <Navbar onAdminClick={() => setShowAdminPage(false)} />
        <AdminPage />
      </div>
    );
  }

  if (selectedColor) {
    if (selectedColor.isMinigame) {
      return (
        <div className="App">
          <Navbar onAdminClick={() => setShowAdminPage(true)} />
          <MiniGame onBack={() => setSelectedColor(null)} />
        </div>
      );
    }
    
    return (
      <div className="App">
        <Navbar onAdminClick={() => setShowAdminPage(true)} />
        <ColorPage color={selectedColor} colorName={selectedColor.name} />
      </div>
    );
  }

  return (
    <div className="App">
      <Navbar onAdminClick={() => setShowAdminPage(true)} />
      <Home onColorSelect={setSelectedColor} />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
