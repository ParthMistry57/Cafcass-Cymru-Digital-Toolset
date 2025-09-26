import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './AdminDashboard.css';
import { useNavigate } from 'react-router-dom';
import buttonClick from '../../assets/audio/button_click.wav';
import Button from '../../components/button';
import { btnGreen, btnPinkLarge } from '../../assets/images/ui';

const AdminDashboard = ({ selectedLanguage }) => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [activeCases, setActiveCases] = useState([]);
    const [selectedCase, setSelectedCase] = useState(null); // Combined state for selected case
    const audio = new Audio(buttonClick);
    audio.volume = 0.1;

        // Setting up the language for translations and loading active cases from local storage
    useEffect(() => {
        i18n.changeLanguage(selectedLanguage);
        const savedCases = JSON.parse(localStorage.getItem('activeCases')) || [];
        setActiveCases(savedCases);
    }, [selectedLanguage, i18n]);

        // Handling the creation of a new case
    const handleNewCase = () => {
        audio.play();
        const newCase = {
            caseId: '', // Initialize with empty or placeholder values
            firstName: '',
            lastName: '',
            dob: '',
            courtId: '',
            enabledModules: []
        };
        localStorage.setItem('currentCase', JSON.stringify(newCase));
        navigate('/setup');
    };

        // Handling the continuation of a selected case
    const handleContinue = () => {
        audio.play();
        if (selectedCase) { // Check if a case is selected
            localStorage.setItem('currentCase', JSON.stringify(selectedCase));
            const { caseId, firstName, lastName } = selectedCase;
            navigate(`/setup`, { state: { caseId, firstName, lastName } }); // Navigate with state to prefill setup page
        }
    };

        // Handling the navigation to the configuration screen
    const handleConfiguration = () => {
        audio.play();
        navigate('/configuration');
    };

        // Handling case selection from the list of active cases using case ID, firstname and lastname
    const handleCaseSelect = (caseData) => {
        setSelectedCase(caseData);
    };
    
    return (
        <div className="admin-dashboard">
            <div className="dashboard-container">
                <h1 className="dashboard-title">{t('you_have_unfinished_work')}</h1>
                <p className="dashboard-subtitle">{t('choose_case')}</p>
                <div className="cases-list">
                    {activeCases.length > 0 ? (
                        activeCases.map((caseData) => (
                            <div
                                key={`${caseData.caseId}-${caseData.firstName}-${caseData.lastName}`} // Unique key for each case
                                className={`case-item ${selectedCase && selectedCase.caseId === caseData.caseId && selectedCase.firstName === caseData.firstName && selectedCase.lastName === caseData.lastName ? 'selected' : ''}`}
                                onClick={() => handleCaseSelect(caseData)}
                            >
                                                            {/* Display case ID, first name, and last name */}
                                <p>{`${caseData.caseId} - ${caseData.firstName} ${caseData.lastName}`}</p>
                            </div>
                        ))
                    ) : (
                        <p>{t('no_active_cases')}</p>
                    )}
                </div>
                <div className="dashboard-buttons">
                                        {/* Continue button is disabled if no case is selected */}
                    <div className="continue-button">
                        <Button onClick={handleContinue} disabled={!selectedCase} text={t('continue')} image={btnPinkLarge} scale={0.7}/>
                    </div>
                    {/* Button to create a new case */}
                    <div className="new-button">
                        <Button onClick={handleNewCase} text={t('New')} image={btnGreen} scale={0.7}/>
                    </div>
                </div>
                                {/* Button to navigate to the configuration screen */}
                <div className="configuration-button">
                    <Button onClick={handleConfiguration} text={t('configuration')} image={btnGreen}/>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
