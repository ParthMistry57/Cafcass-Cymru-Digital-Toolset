import React, { useState, useEffect } from 'react';
import './LetterToJudgeWithHelp.css';
import judge from '../../assets/images/judge.png';
import { useNavigate, useLocation } from 'react-router-dom';
import buttonClick from '../../assets/audio/button_click.wav';
import { useTranslation } from 'react-i18next';
import DisplayUserAvatar from '../AvatarScreen/DisplayUserAvatar';
import html2canvas from 'html2canvas';

const LetterToJudgeWithHelp = ({ selectedLanguage }) => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const storedAvatar = JSON.parse(localStorage.getItem('avatar')) || { name: '', head: 0, torso: 0, legs: 0 };
    const [avatar, setAvatar] = useState(location.state?.avatar || storedAvatar);
    const [responses, setResponses] = useState(JSON.parse(localStorage.getItem('responses')) || Array(4).fill(''));
    const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
    const [displayFullLetter, setDisplayFullLetter] = useState(false);
    const [showPopUp, setShowPopUp] = useState(true);
    const [showSummaryPopup, setShowSummaryPopup] = useState(false);

    const prompts = [
        t('What would you like to stay the same?'),
        t('What needs to change?'),
        t('What would you like to happen next?'),
        t('Is there anything else you\'d like to say?')
    ];

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

    const adjustFontSize = (textarea) => {
        const maxFontSize = 1.8; // in vw
        const minFontSize = 1.2; // in vw
        let fontSize = maxFontSize;
        textarea.style.fontSize = `${fontSize}vw`;

        while (textarea.scrollHeight > textarea.clientHeight && fontSize > minFontSize) {
            fontSize -= 0.1;
            textarea.style.fontSize = `${fontSize}vw`;
        }
    };

    const handleChange = (event) => {
        const newResponses = [...responses];
        newResponses[currentPromptIndex] = event.target.value.split('\n').slice(1).join('\n');
        setResponses(newResponses);
        localStorage.setItem('responses', JSON.stringify(newResponses));

        const textarea = event.target;
        adjustFontSize(textarea);
    };

    const captureScreenshot = async (screenshotLJH) => {
        const container = document.querySelector('.letter-help-container');
 
        const canvas = await html2canvas(container, {
            allowTaint: true,
            foreignObjectRendering: true,
            scale: window.devicePixelRatio,
            useCORS: true,
            logging: true,
        });
        const screenshot = canvas.toDataURL();
        localStorage.setItem(screenshotLJH, screenshot);    
    };

    const handleNext = () => {
        audio.play();
        if (displayFullLetter) {
            if (showSummaryPopup) {
                navigate('/final-comments', { state: { letter: responses.join('') } });
            } else {
                setShowSummaryPopup(true);
            }
        } else if (currentPromptIndex < prompts.length - 1) {
            setCurrentPromptIndex(currentPromptIndex + 1);
            setShowPopUp(true);
            captureScreenshot('screenshotLJH'+currentPromptIndex);
        } else {
            setDisplayFullLetter(true);
            setShowPopUp(false);
            captureScreenshot('screenshotLJH3');
        }
    };

    const handlePrevious = () => {
        audio.play();
        if (displayFullLetter) {
            setDisplayFullLetter(false);
            setCurrentPromptIndex(prompts.length - 1);
        } else if (currentPromptIndex > 0) {
            setCurrentPromptIndex(currentPromptIndex - 1);
        } else {
            navigate('/letter-to-judge');
        }
    };

    const handleUndo = () => {
        audio.play();
        const emptyResponses = Array(prompts.length).fill(''); // Reset responses to an empty array
        setResponses(emptyResponses);
        localStorage.removeItem('responses');
    };

    const summary = () => {
        return prompts.map((prompt, index) => `${prompt}\n${responses[index]}`).join('\n\n');
    };

    const closePopupMessage = () => {
        setShowPopUp(false);
    };

    const closeSummaryPopupMessage = () => {
        setShowSummaryPopup(false);
    };

    const getPopupMessage = () => {
        return t('Write down what you would like to say to the judge.');
    };

    const getSummaryPopupMessage = () => {
        return t('Check if you are happy with your letter. You can change it if you need to.');
    };

    return (
        <div className="letter-help-container">
            <header>
                <div className="undo-button" onClick={handleUndo}>Undo</div>
                <div className="header">{avatar.name} {t('letter to the judge')}</div>
            </header>
            <main>
                <textarea
                    className="letter-help-textarea"
                    value={displayFullLetter ? summary() : `${prompts[currentPromptIndex]}\n${responses[currentPromptIndex]}`}
                    onChange={handleChange}
                    placeholder={t('Type your response here...')}
                    readOnly={displayFullLetter}
                />
            </main>
            <div className="AvatarHelp">
                <DisplayUserAvatar head={avatar.head} torso={avatar.torso} leg={avatar.legs} />
            </div>
            <div className="JudgeHelp">
                <img src={judge} alt="Judge" />
            </div>
            <div className="navigation-button left" onClick={handlePrevious}></div>
            <div className="navigation-button right" onClick={handleNext}></div>
            <div className="help-button" onClick={() => console.log('Help clicked')}></div>
            {showPopUp && (
                <div className="PopUp">
                    <div className="PopUp-content">
                        <span className="close-button" onClick={closePopupMessage}>×</span>
                        <p>{getPopupMessage()}</p>
                    </div>
                </div>
            )}
            {showSummaryPopup && (
                <div className="PopUp">
                    <div className="PopUp-content">
                        <span className="close-button" onClick={closeSummaryPopupMessage}>×</span>
                        <p>{getSummaryPopupMessage()}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LetterToJudgeWithHelp;
