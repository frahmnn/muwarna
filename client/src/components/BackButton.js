import React from 'react';
import './BackButton.css';

function BackButton({ onBack, label = '← Kembali', className = '' }) {
  const handleClick = (e) => {
    e.preventDefault();
    if (typeof onBack === 'function') return onBack();
    if (window && window.history && window.history.length > 1) {
      window.history.back();
      return;
    }
    // fallback: do nothing
  };

  return (
    <button className={`back-button ${className}`} onClick={handleClick}>
      {label}
    </button>
  );
}

export default BackButton;
