// src/components/Loader/Loader.jsx
import React from 'react';
import './Loader.css';

const Loader = ({ fullPage = false }) => {
  return (
    <div className={`loader-container ${fullPage ? 'full-page' : ''}`}>
      <div className="loader-spinner"></div>
    </div>
  );
};

export default Loader;