import React from 'react';
import { useTranslation } from 'react-i18next';
import './HelpModal.css';
import clickSoundFile from '../../assets/audio/click.mp3';

const HelpModal = ({ show, onClose }) => {
  const { t } = useTranslation();

  if (!show) {
    return null;
  }

  const clickSound = new Audio(clickSoundFile);
  clickSound.volume = 0.1;

  const handleCloseButtonClick = () => {
    clickSound.play();
    setTimeout(onClose);
  };

  return (
    <div className="help-modal-overlay">
      <div className="help-modal">
        <button className="close-button" onClick={handleCloseButtonClick}>×</button>
        <h2>{t('help_make_wish_1.title')}</h2>
        <p>{t('help_make_wish_1.content')}</p>
      </div>
    </div>
  );
};

export default HelpModal;