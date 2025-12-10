import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './MiniGame.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function MiniGame({ onBack }) {
  const { selectedProfile } = useAuth();
  const [difficulty, setDifficulty] = useState(null);
  const [gameState, setGameState] = useState('menu'); // 'menu', 'playing', 'completed'
  const [selectedColors, setSelectedColors] = useState([]);
  const [objects, setObjects] = useState([]);
  const [draggedObject, setDraggedObject] = useState(null);
  const [matches, setMatches] = useState({});
  const [score, setScore] = useState(0);

  // All available objects by color
  const allColorObjects = {
    'Merah': [
      { id: 'merah-1', name: 'Apel', image: '/images/red-apple.svg', color: 'Merah' },
      { id: 'merah-2', name: 'Mobil Pemadam', image: '/images/fire-engine.svg', color: 'Merah' },
      { id: 'merah-3', name: 'Lobster', image: '/images/lobster.svg', color: 'Merah' }
    ],
    'Kuning': [
      { id: 'kuning-1', name: 'Pisang', image: '/images/banana.svg', color: 'Kuning' },
      { id: 'kuning-2', name: 'Lemon', image: '/images/lemon.svg', color: 'Kuning' },
      { id: 'kuning-3', name: 'Matahari', image: '/images/sun.svg', color: 'Kuning' }
    ],
    'Hijau': [
      { id: 'hijau-1', name: 'Daun', image: '/images/leaf.svg', color: 'Hijau' },
      { id: 'hijau-2', name: 'Melon', image: '/images/melon.svg', color: 'Hijau' },
      { id: 'hijau-3', name: 'Semangka', image: '/images/watermelon.svg', color: 'Hijau' }
    ]
  };

  const colorData = {
    'Merah': { solid: '#e74c3c', gradient: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)' },
    'Kuning': { solid: '#f1c40f', gradient: 'linear-gradient(135deg, #f1c40f 0%, #f39c12 100%)' },
    'Hijau': { solid: '#2ecc71', gradient: 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)' }
  };

  const startGame = (selectedDifficulty) => {
    setDifficulty(selectedDifficulty);
    
    const availableColors = ['Merah', 'Kuning', 'Hijau'];
    
    // Determine number of colors and objects based on difficulty
    let numColors, numObjectsPerColor;
    if (selectedDifficulty === 'sangat-mudah') {
      numColors = 2;
      numObjectsPerColor = 2;
    } else if (selectedDifficulty === 'mudah') {
      numColors = 3;
      numObjectsPerColor = 3;
    }
    
    // Randomly select colors
    const shuffledColors = [...availableColors].sort(() => Math.random() - 0.5);
    const chosenColors = shuffledColors.slice(0, numColors);
    setSelectedColors(chosenColors);
    
    // Select random objects from each chosen color
    const gameObjects = [];
    chosenColors.forEach(colorName => {
      const colorObjs = [...allColorObjects[colorName]];
      const shuffled = colorObjs.sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, numObjectsPerColor);
      gameObjects.push(...selected);
    });
    
    // Shuffle objects for display
    const shuffledObjects = gameObjects.sort(() => Math.random() - 0.5);
    setObjects(shuffledObjects);
    
    setMatches({});
    setScore(0);
    setGameState('playing');
  };

  const handleDragStart = (object) => {
    setDraggedObject(object);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (colorName) => {
    if (!draggedObject) return;
    
    if (draggedObject.color === colorName) {
      // Correct match
      setMatches(prev => ({
        ...prev,
        [draggedObject.id]: colorName
      }));
      setScore(prev => prev + 1);
      
      // Speak object name
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(`Benar! ${draggedObject.name}`);
        utterance.lang = 'id-ID';
        window.speechSynthesis.speak(utterance);
      }
      
      // Check if game is completed
      if (Object.keys(matches).length + 1 === objects.length) {
        setTimeout(() => {
          setGameState('completed');
          
          // Save minigame completion to backend
          if (selectedProfile?._id) {
            const token = localStorage.getItem('token');
            axios.put(
              `http://localhost:5000/api/profiles/${selectedProfile._id}`,
              { minigameCompleted: true },
              { headers: { Authorization: `Bearer ${token}` } }
            ).catch(err => console.error('Failed to save minigame completion:', err));
          }
          
          const audio = new Audio('/crowd-cheer-ii-6263.mp3');
          audio.play().catch(err => console.log('Audio play error:', err));
        }, 500);
      }
    } else {
      // Wrong match - shake animation
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance('Coba lagi!');
        utterance.lang = 'id-ID';
        window.speechSynthesis.speak(utterance);
      }
    }
    
    setDraggedObject(null);
  };

  const handleTouchStart = (object) => {
    setDraggedObject(object);
  };

  const handleTouchEnd = (colorName) => {
    if (!draggedObject) return;
    handleDrop(colorName);
  };

  return (
    <div className="minigame-page">
      <button className="back-button" onClick={onBack}>
        ← Kembali
      </button>

      {gameState === 'menu' && (
        <div className="minigame-menu">
          <h1 className="minigame-title">Permainan Warna! 🎮</h1>
          <p className="minigame-subtitle">Pilih Tingkat Kesulitan</p>
          
          <div className="difficulty-buttons">
            <button 
              className="difficulty-btn very-easy"
              onClick={() => startGame('sangat-mudah')}
            >
              <span className="difficulty-emoji">😊</span>
              <span className="difficulty-name">Sangat Mudah</span>
              <span className="difficulty-desc">2 warna, 4 benda</span>
            </button>
            
            <button 
              className="difficulty-btn easy"
              onClick={() => startGame('mudah')}
            >
              <span className="difficulty-emoji">🙂</span>
              <span className="difficulty-name">Mudah</span>
              <span className="difficulty-desc">3 warna, 9 benda</span>
            </button>
          </div>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="minigame-playing">
          <h2 className="game-instruction">Cocokkan benda dengan warnanya! 🎯</h2>
          
          <div className="game-area">
            <div className="color-zones">
              {selectedColors.map(colorName => (
                <div
                  key={colorName}
                  className="color-zone"
                  style={{ background: colorData[colorName].gradient }}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(colorName)}
                  onTouchEnd={() => handleTouchEnd(colorName)}
                >
                  <h3 className="zone-title">{colorName}</h3>
                  <div className="matched-objects">
                    {objects
                      .filter(obj => matches[obj.id] === colorName)
                      .map(obj => (
                        <img
                          key={obj.id}
                          src={obj.image}
                          alt={obj.name}
                          className="matched-object"
                        />
                      ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="objects-pool">
              {objects
                .filter(obj => !matches[obj.id])
                .map(obj => (
                  <div
                    key={obj.id}
                    className="draggable-object"
                    draggable
                    onDragStart={() => handleDragStart(obj)}
                    onTouchStart={() => handleTouchStart(obj)}
                  >
                    <img src={obj.image} alt={obj.name} />
                    <p className="object-label">{obj.name}</p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {gameState === 'completed' && (
        <div className="minigame-completed">
          <div className="completion-celebration">
            <div className="celebration-stars">⭐🌟✨⭐🌟</div>
            <h2 className="celebration-title">Luar Biasa! 🎉</h2>
            <p className="celebration-message">
              Kamu berhasil mencocokkan semua benda!
            </p>
            <div className="completion-buttons">
              <button className="play-again-btn" onClick={() => startGame(difficulty)}>
                🔄 Main Lagi
              </button>
              <button className="menu-btn" onClick={() => setGameState('menu')}>
                📋 Menu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MiniGame;
