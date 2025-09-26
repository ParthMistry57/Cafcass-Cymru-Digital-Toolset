import React, { useState, useEffect } from 'react';
import './WriteALetterToJudge.css';
import judge from '../../assets/images/judge.png';
import { useNavigate, useLocation } from 'react-router-dom';
import buttonClick from '../../assets/audio/button_click.wav';
import { useTranslation } from 'react-i18next';
import DisplayUserAvatar from '../AvatarScreen/DisplayUserAvatar';
import html2canvas from 'html2canvas';

const WriteALetterToJudge = ({ selectedLanguage }) => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const storedAvatar = JSON.parse(localStorage.getItem('avatar')) || { name: '', head: 0, torso: 0, legs: 0 };
    const [avatar, setAvatar] = useState(location.state?.avatar || storedAvatar); 
    const [letterContent, setLetterContent] = useState(localStorage.getItem('letterToJudge') || ''); // Load from local storage
    const [showPopup, setShowPopup] = useState(false);
    const [popupShown, setPopupShown] = useState(false);
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

    useEffect(() => {
        const savedLetter = localStorage.getItem('letterToJudge');
        if (savedLetter) {
          setLetterContent(savedLetter);
        } else {
          setLetterContent(''); // Clear the letter if no saved data
        }
    }, []);

    const handleChange = (event) => {
        const textarea = event.target;
        const content = textarea.value;
        setLetterContent(content);
        localStorage.setItem('letterToJudge', content); // Save to local storage

        // Dynamic font size adjustment
        adjustFontSize(textarea);
    };

    const adjustFontSize = (textarea) => {
        const maxHeight = parseInt(window.getComputedStyle(textarea).getPropertyValue('height'), 10);
        const initialFontSize = 1.5; // Initial font size in vw
        let fontSize = parseFloat(window.getComputedStyle(textarea).getPropertyValue('font-size'));

        // Reduce the font size if the content height exceeds the maxHeight
        while (textarea.scrollHeight > maxHeight && fontSize > 1) {
            fontSize -= 0.1;
            textarea.style.fontSize = `${fontSize}px`;
        }

        // Increase the font size if there's room for it
        while (textarea.scrollHeight <= maxHeight && fontSize < initialFontSize * 16) {
            fontSize += 0.1;
            textarea.style.fontSize = `${fontSize}px`;
            if (textarea.scrollHeight > maxHeight) {
                fontSize -= 0.1;
                textarea.style.fontSize = `${fontSize}px`;
                break;
            }
        }
    };

    const captureScreenshot = async () => {
        const container = document.querySelector('.letter-container');
 
        const canvas = await html2canvas(container, {
            allowTaint: true,
            foreignObjectRendering: true,
            scale: window.devicePixelRatio,
            useCORS: true,
            logging: true,
        });
        const screenshot = canvas.toDataURL();
        localStorage.setItem('writeLetterToJudgeScreenshot', screenshot);    
    };
    

    const NextScreen = async () => {
        audio.play();
        if (letterContent && !popupShown) {
            setShowPopup(true);
            setPopupShown(true);
        } else {
            console.log('Letter content:', letterContent);
            await captureScreenshot();
            navigate('/final-comments');
        }
    };

    const PreviousScreen = async () => {
        audio.play();
        navigate('/letter-to-judge');
    };

    const handleUndo = () => {
        audio.play();
        setLetterContent('');
        localStorage.removeItem('letterToJudge'); // Clear local storage on undo
    };

    const closePopup = () => {
        setShowPopup(false);
    };

    return (
        <div className="letter-container">
            <header>
                <div className="undo-button" onClick={handleUndo}>{t('Undo')}</div>
                <div className="header">{avatar.name}{t('letter to the judge')}</div>
            </header>
            <main>
                <textarea
                    className="letter-textarea"
                    value={letterContent}
                    onChange={handleChange}
                    placeholder={t('Start writing your letter to judge...')}
                />
            </main>
            <div className="Avatar">
                <DisplayUserAvatar head={avatar.head} torso={avatar.torso} leg={avatar.legs} />
            </div>
            <div className="Judge">
                <img src={judge} alt="Character Right" />
            </div>

            {showPopup && (
                <div className="popup">
                    <div className="popup-content">
                        <span className="close-button" onClick={closePopup}>×</span>
                        <p>{t('Check if you are happy with your letter. You can change it if you need to.')}</p>
                    </div>
                </div>
            )}

            <div className="navigation-button left" onClick={PreviousScreen}></div>
            <div className="navigation-button right" onClick={NextScreen}></div>
            <div className="help-button" onClick={() => console.log('Help clicked')}></div>
        </div>
    );
};

export default WriteALetterToJudge;
