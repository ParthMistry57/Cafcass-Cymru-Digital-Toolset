import React from 'react';
import './LoadingScreen.css';
import logo from '../../assets/images/logo.png';
import preloaderFG from '../../assets/images/preloaderFG.png';
import preloaderBG from '../../assets/images/preloaderBG.png';

const LoadingScreen = ({ progress }) => {
  return (
    <div className="loading-screen">
      <img src={logo} alt="Logo" className="loading-screen-logo" />
      <div className="loading-screen-progress-container">
        <img src={preloaderBG} alt="Progress Bar Background" className="loading-screen-progress-bg" />
        <div className="loading-screen-progress-bar" style={{ width: `${progress}%` }}>
          <img src={preloaderFG} alt="Progress Bar Foreground" className="loading-screen-progress-fg" />
          <div className="loading-screen-progress-text">{progress}%</div>
        </div>
      </div>
      <div className="loading-screen-loading-message">Loading...</div>
    </div>
  );
};

export default LoadingScreen;