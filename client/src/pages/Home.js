import React from 'react';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const colors = [
  { name: 'Merah', emoji: '🍎', solid: '#e74c3c', gradient: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)' },
  { name: 'Jingga', emoji: '🍊', solid: '#e67e22', gradient: 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)' },
  { name: 'Kuning', emoji: '🌻', solid: '#f1c40f', gradient: 'linear-gradient(135deg, #f1c40f 0%, #f39c12 100%)' },
  { name: 'Hijau', emoji: '🌿', solid: '#2ecc71', gradient: 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)' },
  { name: 'Biru', emoji: '🌊', solid: '#3498db', gradient: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)' },
  { name: 'Nila', emoji: '🦋', solid: '#5f27cd', gradient: 'linear-gradient(135deg, #5f27cd 0%, #341f97 100%)' },
  { name: 'Ungu', emoji: '🍇', solid: '#9b59b6', gradient: 'linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)' }
];

const minigameCard = {
  name: 'Permainan',
  emoji: '🎮',
  gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  isMinigame: true
};

function Home({ onColorSelect }) {
  const { user, selectedProfile } = useAuth();
  
  const achievements = selectedProfile?.achievements || {};
  const minigamesCleared = selectedProfile?.minigamesCleared || 0;
  
  const colorMedals = [
    { name: 'Merah', key: 'merah', emoji: '🍎', color: '#e74c3c' },
    { name: 'Jingga', key: 'jingga', emoji: '🍊', color: '#e67e22' },
    { name: 'Kuning', key: 'kuning', emoji: '🌻', color: '#f1c40f' },
    { name: 'Hijau', key: 'hijau', emoji: '🌿', color: '#2ecc71' },
    { name: 'Biru', key: 'biru', emoji: '🌊', color: '#3498db' },
    { name: 'Nila', key: 'nila', emoji: '🦋', color: '#5f27cd' },
    { name: 'Ungu', key: 'ungu', emoji: '🍇', color: '#9b59b6' }
  ];
  
  const totalAchievements = Object.values(achievements).filter(Boolean).length;

  return (
    <div className="home">
      <div className="hero-section">
        <h1 className="hero-title">
          Halo, {selectedProfile?.name || user?.name.split(' ')[0]}! 👋
        </h1>
        <p className="hero-subtitle">
          Ayo Belajar Warna! 🎨
        </p>
      </div>

      <div className="colors-section">
        <div className="colors-grid">
          {colors.map((color) => (
            <div
              key={color.name}
              className="color-card"
              style={{ background: color.gradient }}
              onClick={() => onColorSelect(color)}
            >
              <div className="color-emoji">{color.emoji}</div>
              <div className="color-name">{color.name}</div>
            </div>
          ))}
          
          <div
            className="color-card minigame-card"
            style={{ background: minigameCard.gradient }}
            onClick={() => onColorSelect(minigameCard)}
          >
            <div className="color-emoji">{minigameCard.emoji}</div>
            <div className="color-name">{minigameCard.name}</div>
          </div>
        </div>
      </div>

      {/* Medal Gallery */}
      <div className="medal-gallery-section">
        <h2 className="gallery-title">Koleksi Medali 🏆</h2>
        
        <div className="stats-summary">
          <div className="stat-card">
            <span className="stat-emoji">🎨</span>
            <span className="stat-number">{totalAchievements}/7</span>
            <span className="stat-label">Warna Selesai</span>
          </div>
          <div className="stat-card">
            <span className="stat-emoji">🎮</span>
            <span className="stat-number">{minigamesCleared}</span>
            <span className="stat-label">Permainan</span>
          </div>
        </div>

        <div className="medals-grid">
          {colorMedals.map(medal => (
            <div 
              key={medal.key}
              className={`medal-card ${achievements[medal.key] ? 'unlocked' : 'locked'}`}
            >
              <div 
                className="medal-icon"
                style={{ 
                  background: achievements[medal.key] 
                    ? medal.color 
                    : '#ddd'
                }}
              >
                {achievements[medal.key] ? '🏅' : '🔒'}
              </div>
              <div className="medal-name">{medal.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
