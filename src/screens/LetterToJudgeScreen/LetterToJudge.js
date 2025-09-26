import React from 'react';
import './LetterToJudge.css';
import judge from '../../assets/images/judge.png'
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import buttonClick from '../../assets/audio/button_click.wav';
import DisplayUserAvatar from '../AvatarScreen/DisplayUserAvatar';


const LetterToJudge = ({ selectedLanguage }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const storedAvatar = JSON.parse(localStorage.getItem('avatar')) || { name: '', head: 0, torso: 0, legs: 0 };
  const [avatar, setAvatar] = useState(location.state?.avatar || storedAvatar); 
  const audio = new Audio(buttonClick);
  audio.volume = 0.1;

  useEffect(() => {
    i18n.changeLanguage(selectedLanguage);
  }, [selectedLanguage, i18n]);

  useEffect(() => {
    if (location.state?.avatar) {
      setAvatar(location.state.avatar);
    }
  }, [location.state]);

  const PreviousScreen = () => {
    audio.play();
    navigate('/make-a-wish');
  };

  const WriteLetterToJudge = () => {
    audio.play();
    navigate('/Write-letter-to-judge');
  };

  const LetterToJudgeWithHelp = () => {
    audio.play();
    navigate('/letter-to-judge-With-Help');
  };

  const LetterToJudgeWithTools = () => {
    audio.play();
    navigate('/Letter-To-Judge-With-Tools');
  };

  const NextScreen = () => {
    audio.play();
    navigate('/Write-letter-to-judge');
  };

  const NextTool = () => {
    audio.play();
    navigate('/final-comments');
  };

  return (
    <div className="letter-to-judge">
        <div className="header">{avatar.name}{t('letter to the judge')}</div>
        <div className="intro-text-container">
            <div className="intro-text">{t('There is a big decision the family court will make for you. You can tell the judge what you think should happen.')}</div>
        </div>
      <div className="button-container">
        <div className="button-row">
          <button className="button write-letter" onClick={WriteLetterToJudge}>{t('Write a letter')}</button>
          <button className="button write-letter-help" onClick={LetterToJudgeWithHelp}>{t("Write a letter with help")}</button>
          <button className="button write-letter-with-tools" onClick={LetterToJudgeWithTools}>{t("Write a letter with tools")}</button>
        </div>
        <div className="button-row">
          <button className="button not-now" id="not-now" onClick={NextTool}>{t('Not Now')}</button>
        </div>
      </div>
      <div className="character-left">
      <DisplayUserAvatar head={avatar.head} torso={avatar.torso} leg={avatar.legs} />
      </div>
      <div className="character-right">
        <img src={judge} alt="Character Right" />
      </div>
      <div className="navigation-button left" onClick={PreviousScreen}></div>
      <div className="navigation-button right" onClick={NextScreen}></div>
      <div className="help-button" onClick={() => console.log('Help clicked') }></div>
    </div>
  );
};

export default LetterToJudge;