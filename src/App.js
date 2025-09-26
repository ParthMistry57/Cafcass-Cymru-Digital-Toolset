import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';import { useTranslation } from 'react-i18next';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import LoadingScreen from './screens/LoadingScreen/LoadingScreen';
import StartScreen from './screens/StartScreen/StartScreen';
import AvatarScreen from './screens/AvatarScreen/AvatarScreen';
import FinalCommentsScreen from './screens/FinalCommentsScreen/FinalCommentsScreen';
import CompleteScreen from './screens/CompleteScreen/CompleteScreen';
import SetupScreen from './screens/SetupScreen/Setup';
import DirectWorkScreen from './screens/DirectWorkScreen/DirectWorkScreen';
import LetterToJudge from './screens/LetterToJudgeScreen/LetterToJudge';
import DisplayStoredData from './screens/SetupScreen/DisplayStoredData';
import AdminDashboard from './screens/AdminDashboardScreen/AdminDashboard';
import WriteALetterToJudge from './screens/WriteALetterToJudge/WriteALetterToJudge';
import ConfigurationScreen from './screens/ConfigurationScreen/ConfigurationScreen';
import SettingsButton from './components/SettingsButton';
import './App.css';
import './i18n';
import SliderDesigner from './screens/ConfigurationScreen/SliderDesigner';
import LetterToJudgeWithHelp from './screens/LetterToJudgeWithHelp/LetterToJudgeWithHelp';
import MakeAWishScreen from './screens/MakeAWishScreen/MakeAWishScreen';
import MakeAWishScreen2 from './screens/MakeAWishScreen/MakeAWishScreen2';
import MakeAWishScreen3 from './screens/MakeAWishScreen/MakeAWishScreen3';
import LetterToJudgeWithTools from './screens/LetterToJudgeWithTools/LetterToJudgeWithTools';


function App() {
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(12);
    const { i18n } = useTranslation();
    const [fontSize, setFontSize] = useState(1.0);
    const [isHighContrast, setHighContrast] = useState(false);


    useEffect(() => {
        const savedLanguage = localStorage.getItem('selectedLanguage');
        if (savedLanguage) {
            i18n.changeLanguage(savedLanguage);
        }


        const savedFontSize = localStorage.getItem('fontSize');
        if (savedFontSize) {
            setFontSize(parseFloat(savedFontSize));
        }


        const savedContrast = localStorage.getItem('isHighContrast');
        if (savedContrast) {
            setHighContrast(savedContrast === 'true');
        }


        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setLoading(false);
                    return 100;
                }
                return prev + 4;
            });
        }, 110);


        return () => clearInterval(interval);
    }, [i18n]);


    const handleLanguageChange = (language) => {
        i18n.changeLanguage(language);
        localStorage.setItem('selectedLanguage', language);
    };


    const handleFontSizeChange = (adjustment) => {
        setFontSize((prev) => {
            const newFontSize = Math.max(prev + adjustment, 0.5);
            localStorage.setItem('fontSize', newFontSize);
            return newFontSize;
        });
    };


    const toggleContrast = () => {
        setHighContrast((prev) => {
            const newContrast = !prev;
            localStorage.setItem('isHighContrast', newContrast);
            return newContrast;
        });
    };


    const resetTheme = () => {
        setFontSize(1.0);
        setHighContrast(false);
        localStorage.removeItem('fontSize');
        localStorage.removeItem('isHighContrast');
    };


    if (loading) {
        return <LoadingScreen progress={progress} />;
    }


    return (
        <DndProvider backend={HTML5Backend}>
            <Router>
                <div className={`App ${isHighContrast ? 'high-contrast' : ''}`} style={{ fontSize: `${fontSize}em` }}>
                    <SettingsButton
                        onFontSizeChange={handleFontSizeChange}
                        toggleContrast={toggleContrast}
                        resetTheme={resetTheme}
                    />
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <StartScreen
                                    selectedLanguage={i18n.language} // Pass the current language as a prop
                                    onLanguageChange={handleLanguageChange}
                                    fontSize={fontSize}
                                />
                            }
                        />
                        <Route
                            path="/avatar"
                            element={<AvatarScreen fontSize={fontSize} />}
                        />
                        <Route
                            path="/configuration"
                            element={<ConfigurationScreen fontSize={fontSize} />}
                        />
                        <Route
                            path="/configuration/slider-designer"
                            element={<SliderDesigner fontSize={fontSize} />}
                        />
                        <Route
                            path="/setup"
                            element={<SetupScreen fontSize={fontSize} />}
                        />
                        <Route
                            path="/direct-work"
                            element={<DirectWorkScreen fontSize={fontSize} />}
                        />
                        <Route
                            path="/letter-to-judge"
                            element={<LetterToJudge fontSize={fontSize} />}
                        />
                        <Route
                            path="/final-comments"
                            element={<FinalCommentsScreen fontSize={fontSize} />}
                        />
                        <Route
                            path="/write-letter-to-judge"
                            element={<WriteALetterToJudge fontSize={fontSize} />}
                        />
                        <Route
                            path="/letter-to-judge-With-Help"
                            element={<LetterToJudgeWithHelp />}
                        />
                        <Route
                            path="/make-a-wish"
                            element={<MakeAWishScreen fontSize={fontSize} />}
                        />
                        <Route
                            path="/make-a-wish-future"
                            element={<MakeAWishScreen2 fontSize={fontSize} />}
                        />
                        <Route
                            path="/make-a-wish-family"
                            element={<MakeAWishScreen3 fontSize={fontSize} />}
                        />
                        <Route
                            path="/Letter-To-Judge-With-Tools"
                            element={<LetterToJudgeWithTools fontSize={fontSize} />}
                        />
                        <Route
                            path="/complete"
                            element={<CompleteScreen fontSize={fontSize} />}
                        />
                        <Route
                            path="/data"
                            element={<DisplayStoredData fontSize={fontSize} />}
                        />
                        <Route
                            path="/admin-dashboard"
                            element={<AdminDashboard fontSize={fontSize} />}
                        />
                    </Routes>
                </div>
            </Router>
        </DndProvider>
    );
}


export default App;