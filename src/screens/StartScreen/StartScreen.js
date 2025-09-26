import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import '../../i18n';
import './StartScreen.css';
import startBG from '../../assets/images/startBG.png';

const StartScreen = ({ selectedLanguage, onLanguageChange, fontSize }) => {
  const { t } = useTranslation(); // Hook for translation functions
  const navigate = useNavigate(); // Hook for navigation

  // Function to handle start button click
  const handleStartClick = () => {
    navigate('/admin-dashboard'); // Navigate to FinalCommentsScreen
  };

  return (
    <div className="start-screen" style={{ backgroundImage: `url(${startBG})`, fontSize: `${fontSize}em` }}>
      {/* Language selection buttons */}
      <div className="start-screen-language-selection">
        <button
          className={`start-screen-language-button ${selectedLanguage === 'en' ? 'selected' : ''}`}
          onClick={() => onLanguageChange('en')}
        >
          English
        </button>
        <button
          className={`start-screen-language-button ${selectedLanguage === 'cy' ? 'selected' : ''}`}
          onClick={() => onLanguageChange('cy')}
        >
          Cymraeg
        </button>
      </div>

      {/* Title section */}
      <h1 className="start-screen-title">
        <span className="start-screen-title-line1">{t('how_it_looks_to')}</span>
        <span className="start-screen-title-line2">{t('me')}</span>
      </h1>

      {/* Start button */}
      <button className="start-screen-start-button" onClick={handleStartClick}>
        {t('start')}
      </button>
    </div>
  );
}

export default StartScreen;