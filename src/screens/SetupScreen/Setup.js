import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './setup.css';
import { useNavigate, useLocation } from 'react-router-dom';
import buttonClick from '../../assets/audio/button_click.wav';
import Button from '../../components/button';
import { btnPink1 } from '../../assets/images/ui';

const SetupScreen = ({ selectedLanguage }) => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const audio = new Audio(buttonClick);
    audio.volume = 0.1;

    // Initialize form data with empty values and enabledModules
    const [formData, setFormData] = useState(() => {
        const currentCase = JSON.parse(localStorage.getItem('currentCase')) || {
            firstName: '',
            lastName: '',
            dob: '',
            caseId: '',
            courtId: '',
            enabledModules: []  // Initialize with an empty array
        };
        return currentCase;
    });

    const [errors, setErrors] = useState({});
    const [availableModules, setAvailableModules] = useState([]);

    // Setting the language for translations
    useEffect(() => {
        i18n.changeLanguage(selectedLanguage);
    }, [selectedLanguage, i18n]);

    // Fetching available modules from localStorage
    useEffect(() => {
        const savedModules = JSON.parse(localStorage.getItem('modules')) || [];
        const activeModules = savedModules.filter(module => module.isEnabled);
        setAvailableModules(activeModules);
    }, []);

    // Check if state was passed through navigation
    useEffect(() => {
        if (location.state) {
            const { caseId, firstName, lastName } = location.state;
            const savedCases = JSON.parse(localStorage.getItem('activeCases')) || [];
            const caseData = savedCases.find(
                item =>
                    item.caseId === caseId &&
                    item.firstName === firstName &&
                    item.lastName === lastName
            );
            if (caseData) {
                setFormData((prevData) => {
                    if (JSON.stringify(prevData) !== JSON.stringify(caseData)) {
                        return caseData;
                    }
                    return prevData;
                });
            }
        }
    }, [location.state]);

    // Handling input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    // Handling module checkbox changes
    const handleModuleChange = (e) => {
        const { id, checked } = e.target;
        setFormData((prevData) => {
            const updatedModules = checked
                ? [...prevData.enabledModules, id]
                : prevData.enabledModules.filter(module => module !== id);

            return {
                ...prevData,
                enabledModules: updatedModules
            };
        });
    };

    // Helper function to check if the date is valid
    const isValidDate = (dateString) => {
        const [year, month, day] = dateString.split('-').map(Number);
        if (year < 1900 || year > new Date().getFullYear()) return false;
        if (month < 1 || month > 12) return false;
        const daysInMonth = new Date(year, month, 0).getDate();
        return day > 0 && day <= daysInMonth;
    };

    // Validating form inputs
    const validate = () => {
        const newErrors = {};
        if (!formData.firstName) newErrors.firstName = t('first_name_required');
        if (!formData.lastName) newErrors.lastName = t('last_name_required');
        if (!formData.dob || !isValidDate(formData.dob)) newErrors.dob = t('dob_invalid');
        if (!formData.caseId) newErrors.caseId = t('case_id_required');
        if (!formData.courtId) newErrors.courtId = t('court_id_required');
        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            Object.keys(newErrors).forEach((key) => {
                const input = document.getElementById(key);
                if (input) {
                    input.classList.add('vibrate');
                    setTimeout(() => input.classList.remove('vibrate'), 300);
                }
            });
        }

        return Object.keys(newErrors).length === 0;
    };

    // Handling form submission and saving the case data
    const handleSave = () => {
        audio.play();
        if (validate()) {
            const savedCases = JSON.parse(localStorage.getItem('activeCases')) || [];
            const { caseId, firstName, lastName, enabledModules } = formData;

            const caseExists = savedCases.some(
                caseItem =>
                    caseItem.caseId === caseId &&
                    caseItem.firstName === firstName &&
                    caseItem.lastName === lastName
            );

            if (caseExists) {
                const updatedCases = savedCases.map((caseItem) =>
                    caseItem.caseId === caseId && caseItem.firstName === firstName && caseItem.lastName === lastName
                        ? { ...formData, enabledModules }
                        : caseItem
                );
                localStorage.setItem('activeCases', JSON.stringify(updatedCases));
            } else {
                savedCases.push({ ...formData, enabledModules });
                localStorage.setItem('activeCases', JSON.stringify(savedCases));
            }

            // Update currentCase with the latest formData
            localStorage.setItem('currentCase', JSON.stringify({ ...formData, enabledModules }));

            navigate('/avatar');
        }
    };

    const adminDashboard = () => {
        audio.play();
        navigate('/admin-dashboard');
    };

    return (
        <div className="body">
            <div className="setup-setup-screen">
                <div className='back-to-dashboard-button'>
                    <Button onClick={adminDashboard} text={t('admin_dashboard')} fontSize='2rem'/>
                </div>
                <div className='save-button'>
                    <Button className="save-button" onClick={handleSave} text={t('save')} image={btnPink1} />
                </div>
                <h1 className="h1">{t('set_up')}</h1>
                {errors.form && <p className="error">{errors.form}</p>}
                <div className='box1'>
                    <div className="setup-details">
                        <div className="setup-input-group">
                            <label htmlFor="firstName">{t('first_name')}</label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                className={`setup-input-medium ${errors.firstName ? 'vibrate' : ''}`}
                                placeholder={t('first_name')}
                                value={formData.firstName}
                                onChange={handleChange}
                            />
                            {errors.firstName && <span className="error">{errors.firstName}</span>}
                        </div>
                        <div className="setup-input-group">
                            <label htmlFor="lastName">{t('last_name')}</label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                className={`setup-input-medium ${errors.lastName ? 'vibrate' : ''}`}
                                placeholder={t('last_name')}
                                value={formData.lastName}
                                onChange={handleChange}
                            />
                            {errors.lastName && <span className="error">{errors.lastName}</span>}
                        </div>
                        <div className="setup-input-group">
                            <label htmlFor="dob">{t('date_of_birth')}</label>
                            <input
                            type="date"
                            id="dob"
                            name="dob"
                            className={`setup-input-medium ${errors.dob ? 'vibrate' : ''}`}
                            placeholder={t('DD/MM/YYYY')}
                            value={formData.dob}
                            onChange={handleChange}
                            min="1900-01-01"  // Setting minimum date to January 1, 1900
                            max={new Date().toISOString().split("T")[0]}  // Setting maximum date to today's date
                        />
                            {errors.dob && <span className="error">{errors.dob}</span>}
                        </div>
                        <div className="setup-input-group">
                            <label htmlFor="caseId">{t('case_id')}</label>
                            <input
                                type="text"
                                id="caseId"
                                name="caseId"
                                className={`setup-input-small ${errors.caseId ? 'vibrate' : ''}`}
                                placeholder={t('case_id')}
                                value={formData.caseId}
                                onChange={handleChange}
                            />
                            {errors.caseId && <span className="error">{errors.caseId}</span>}
                        </div>
                        <div className="setup-input-group">
                            <label htmlFor="courtId">{t('court_id')}</label>
                            <input
                                type="text"
                                id="courtId"
                                name="courtId"
                                className={`setup-input-small ${errors.courtId ? 'vibrate' : ''}`}
                                placeholder={t('court_id')}
                                value={formData.courtId}
                                onChange={handleChange}
                            />
                            {errors.courtId && <span className="error">{errors.courtId}</span>}
                        </div>
                    </div>
                    <div className="setup-tabs-background">
                        <div className="setup-buttons">
                            {/* default tabs */}
                            <div className="setup-button-group setup-static">
                                <label>{t('1_start_screen')}</label>
                            </div>
                            <div className="setup-button-group">
                                <input
                                    type="checkbox"
                                    id="aboutMe"
                                    name="tab"
                                    checked={formData.enabledModules.includes('aboutMe')}
                                    onChange={handleModuleChange}
                                />
                                <label htmlFor="aboutMe">{t('2_about_me')}</label>
                            </div>
                            <div className="setup-button-group">
                                <input
                                    type="checkbox"
                                    id="myJourney"
                                    name="tab"
                                    checked={formData.enabledModules.includes('myJourney')}
                                    onChange={handleModuleChange}
                                />
                                <label htmlFor="myJourney">{t('3_my_journey')}</label>
                            </div>
                            <div className="setup-button-group">
                                <input
                                    type="checkbox"
                                    id="howIFeel"
                                    name="tab"
                                    checked={formData.enabledModules.includes('howIFeel')}
                                    onChange={handleModuleChange}
                                />
                                <label htmlFor="howIFeel">{t('4_how_i_feel')}</label>
                            </div>
                            <div className="setup-button-group">
                                <input
                                    type="checkbox"
                                    id="feelingSafe"
                                    name="tab"
                                    checked={formData.enabledModules.includes('feelingSafe')}
                                    onChange={handleModuleChange}
                                />
                                <label htmlFor="feelingSafe">{t('5_feeling_safe')}</label>
                            </div>
                            <div className="setup-button-group">
                                <input
                                    type="checkbox"
                                    id="threeWishes"
                                    name="tab"
                                    checked={formData.enabledModules.includes('threeWishes')}
                                    onChange={handleModuleChange}
                                />
                                <label htmlFor="threeWishes">{t('6_three_wish')}</label>
                            </div>
                            {/* imported enabled modules from Configuration screen */}
                            {availableModules.map((module) => (
                                <div className="setup-button-group" key={module.name} style={{ backgroundColor: module.color }}>
                                    <input
                                        type="checkbox"
                                        id={module.name}
                                        name="tab"
                                        checked={formData.enabledModules.includes(module.name)}
                                        onChange={handleModuleChange}
                                    />
                                    <label htmlFor={module.name}>{t(module.name)}</label>
                                </div>
                            ))}
                            <div className="setup-button-group">
                                <input
                                    type="checkbox"
                                    id="letterToJudge"
                                    name="tab"
                                    checked={formData.enabledModules.includes('letterToJudge')}
                                    onChange={handleModuleChange}
                                />
                                <label htmlFor="letterToJudge">{t('7_letter_to_judge')}</label>
                            </div>
                            <div className="setup-button-group setup-static">
                                <label>{t('8_summary')}</label>
                            </div>
                            <div className="setup-button-group setup-static">
                                <label>{t('9_feedback')}</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SetupScreen;
