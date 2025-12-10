import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './ColorPage.css';
import BackButton from '../components/BackButton';

const API_URL = process.env.REACT_APP_API_URL || window.location.origin;

function ColorPage({ color, colorName, onBack }) {
  const { selectedProfile } = useAuth();
  const colorKey = colorName?.toLowerCase();
  
  // Define objects for each color
  const colorObjects = {
    'merah': [
      { id: 1, name: 'Apel', image: '/images/red-apple.svg' },
      { id: 2, name: 'Mobil Pemadam', image: '/images/fire-engine.svg' },
      { id: 3, name: 'Lobster', image: '/images/lobster.svg' }
    ],
    'kuning': [
      { id: 1, name: 'Pisang', image: '/images/banana.svg' },
      { id: 2, name: 'Lemon', image: '/images/lemon.svg' },
      { id: 3, name: 'Matahari', image: '/images/sun.svg' }
    ],
    'hijau': [
      { id: 1, name: 'Daun', image: '/images/leaf.svg' },
      { id: 2, name: 'Melon', image: '/images/melon.svg' },
      { id: 3, name: 'Semangka', image: '/images/watermelon.svg' }
    ]
  };
  
  const currentObjects = colorObjects[colorKey] || [];
  const hasLearningGame = currentObjects.length > 0;

  const [currentObjectIndex, setCurrentObjectIndex] = useState(0);
  const [isCurrentHovered, setIsCurrentHovered] = useState(false);
  const [hasBeenHovered, setHasBeenHovered] = useState(false);
  const [completedObjects, setCompletedObjects] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);

  // TTS function to speak object name and its color in Indonesian
  // If `colorLabel` is provided, speak "<name>, warnanya <colorLabel>".
  const speakObjectName = (name, colorLabel) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      const text = colorLabel ? `${name}, warnanya ${colorLabel}` : name;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'id-ID';
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;

      window.speechSynthesis.speak(utterance);
    }
  };

  const handleObjectHover = () => {
    setIsCurrentHovered(true);
    if (!completedObjects.includes(currentObjectIndex)) {
      setHasBeenHovered(true);
    }
    speakObjectName(currentObjects[currentObjectIndex].name, colorName);
  };

  const handleNextObject = () => {
    // Mark current as completed
    if (!completedObjects.includes(currentObjectIndex)) {
      setCompletedObjects([...completedObjects, currentObjectIndex]);
    }

    if (currentObjectIndex < currentObjects.length - 1) {
      const nextIndex = currentObjectIndex + 1;
      setCurrentObjectIndex(nextIndex);
      setIsCurrentHovered(false);
      setHasBeenHovered(completedObjects.includes(nextIndex));
    } else {
      // All objects completed
      console.log(`🎉 Semua objek ${colorName} telah selesai! All ${colorName} objects completed!`);
      console.log(`User has successfully identified all ${colorName} objects:`, currentObjects.map(obj => obj.name));
      
      // Save achievement to backend
      if (selectedProfile?._id) {
        const token = localStorage.getItem('token');
        axios.put(
          `${API_URL}/api/profiles/${selectedProfile._id}`,
          { achievement: colorKey },
          { headers: { Authorization: `Bearer ${token}` } }
        ).catch(err => console.error('Failed to save achievement:', err));
      }
      
      // Play celebration sound
      const audio = new Audio('/crowd-cheer-ii-6263.mp3');
      audio.play().catch(err => console.log('Audio play error:', err));
      
      setIsCompleted(true);
    }
  };

  const handlePrevObject = () => {
    if (currentObjectIndex > 0) {
      const prevIndex = currentObjectIndex - 1;
      setCurrentObjectIndex(prevIndex);
      setIsCurrentHovered(false);
      setHasBeenHovered(completedObjects.includes(prevIndex));
    }
  };

  return (
    <div className="color-page" style={{ background: color.gradient }}>
      <div className="color-content">
        {typeof onBack === 'function' ? (
          <div style={{ marginBottom: '12px' }}>
            <BackButton onBack={onBack} />
          </div>
        ) : null}
        <h1 className="color-title">{colorName} 🎨</h1>
        
        {/* Color Objects Learning Game */}
        {hasLearningGame && !isCompleted && (
          <div className="red-objects-game">
            <div className="game-progress">
              <div className="progress-indicators">
                {currentObjects.map((obj, index) => (
                  <div 
                    key={obj.id} 
                    className={`progress-dot ${completedObjects.includes(index) ? 'completed' : index === currentObjectIndex ? 'active' : ''}`}
                  />
                ))}
              </div>
            </div>

            <div className="object-display">
              <div className="object-container">
                <img
                  src={currentObjects[currentObjectIndex].image}
                  alt={currentObjects[currentObjectIndex].name}
                  className={`red-object ${isCurrentHovered ? 'hovered' : ''}`}
                />
                <img
                  src={currentObjects[currentObjectIndex].image}
                  alt=""
                  className="object-hitarea"
                  onMouseEnter={handleObjectHover}
                  onMouseLeave={() => setIsCurrentHovered(false)}
                />
              </div>
              <p className="object-name">
                {hasBeenHovered ? currentObjects[currentObjectIndex].name : '?'}
              </p>
            </div>

            <div className="navigation-buttons">
              {currentObjectIndex > 0 && (
                <button className="nav-button prev-button" onClick={handlePrevObject}>
                  ←
                </button>
              )}
              
              {hasBeenHovered && (
                <button className="nav-button next-button" onClick={handleNextObject}>
                  {currentObjectIndex < currentObjects.length - 1 ? '→' : '🎉'}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Completion Celebration */}
        {hasLearningGame && isCompleted && (
          <div className="completion-celebration">
            <div className="celebration-stars">⭐🌟✨⭐🌟</div>
            <h2 className="celebration-title">Hebat Sekali! 🎉</h2>
            <p className="celebration-message">Kamu sudah mengenal semua benda {colorName?.toLowerCase()}!</p>
            <div className="completed-objects">
              {currentObjects.map((obj) => (
                <img key={obj.id} src={obj.image} alt={obj.name} className="completed-object-icon" />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ColorPage;
