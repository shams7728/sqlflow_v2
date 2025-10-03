import React from 'react';
import './HamburgerMenu.css';

const HamburgerMenu = ({ isOpen, onClick, className = '', size = 24 }) => {
  return (
    <button
      className={`hamburger-button ${className} ${isOpen ? 'open' : ''}`}
      onClick={onClick}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
      aria-expanded={isOpen}
      style={{
        width: size + 8,
        height: size + 8,
        padding: 4
      }}
    >
      <div 
        className="hamburger-container"
        style={{
          width: size,
          height: size
        }}
      >
        <span className="hamburger-line hamburger-line-1"></span>
        <span className="hamburger-line hamburger-line-2"></span>
        <span className="hamburger-line hamburger-line-3"></span>
      </div>
    </button>
  );
};

export default HamburgerMenu;