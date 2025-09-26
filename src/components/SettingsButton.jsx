import React, { useState } from 'react';
import settingsImage from '../assets/images/ui/setting.png';
import fontSizeIcon from '../assets/images/ui/font-size.png';
import languageIcon from '../assets/images/ui/language.png';
import resetIcon from '../assets/images/ui/reset.png';
import contrastIcon from '../assets/images/ui/contrast.png';
import './SettingsButton.css';
import { useTranslation } from 'react-i18next';

function SettingsButton({ className = 'settings-wrapper', onFontSizeChange, toggleContrast, resetTheme }) {
    const { t, i18n } = useTranslation();
    const [isVisible, setVisibility] = useState(false);
    const [isFontSizeVisible, setFontSizeVisibility] = useState(false);
    const [isLanguageVisible, setLanguageVisibility] = useState(false);

    const openSettings = () => {
        setVisibility(!isVisible);
        if (!isVisible) {
            setFontSizeVisibility(false);
            setLanguageVisibility(false);
        }
    };

    const toggleFontSizeControls = () => {
        setFontSizeVisibility(!isFontSizeVisible);
    };

    const toggleLanguageControls = () => {
        setLanguageVisibility(!isLanguageVisible);
    };

    const changeLanguage = (language) => {
        i18n.changeLanguage(language);
        setLanguageVisibility(false);
    };

    const increaseFontSize = () => {
        onFontSizeChange(0.1); // Increase font size by 0.1em
    };

    const decreaseFontSize = () => {
        onFontSizeChange(-0.1); // Decrease font size by 0.1em
    };

    return (
        <div className={`${className} ${isVisible ? 'expanded' : ''}`}>
            <div className='settings-popup'>
                <div className="font-size-wrapper">
                    <button type="button" className="settings-popup-button font-size" onClick={toggleFontSizeControls}>
                        <img src={fontSizeIcon} alt={t("Font Size")} />
                    </button>
                    {isFontSizeVisible && (
                        <div className="font-size-controls">
                            <button type="button" className="font-size-control" onClick={increaseFontSize}>+</button>
                            <button type="button" className="font-size-control" onClick={decreaseFontSize}>-</button>
                        </div>
                    )}
                </div>
                <div className="language-wrapper">
                    <button type="button" className="settings-popup-button language" onClick={toggleLanguageControls}>
                        <img src={languageIcon} alt={t("Language")} />
                    </button>
                    {isLanguageVisible && (
                        <div className="language-controls">
                            <button type="button" className="language-control" onClick={() => changeLanguage('en')}>EN</button>
                            <button type="button" className="language-control" onClick={() => changeLanguage('cy')}>CY</button>
                        </div>
                    )}
                </div>
                <button type="button" className="settings-popup-button contrast" onClick={toggleContrast}>
                    <img src={contrastIcon} alt={t("Contrast")} />
                </button>
                <button type="button" className="settings-popup-button theme" onClick={resetTheme}>
                    <img src={resetIcon} alt={t("Reset")} />
                </button>
            </div>
            <button className='settings-btn' onClick={openSettings}>
                <img src={settingsImage} alt="Settings" />
            </button>
        </div>
    );
}

export default SettingsButton;