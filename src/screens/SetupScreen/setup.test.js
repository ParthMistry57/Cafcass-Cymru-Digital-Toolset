import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';
import SetupScreen from './Setup';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
    useLocation: () => ({
        state: {
            caseId: '123',
            firstName: 'John',
            lastName: 'Doe'
        }
    })
}));

// Mock localStorage
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => {
            store[key] = value.toString();
        },
        clear: () => {
            store = {};
        },
        removeItem: (key) => {
            delete store[key];
        },
    };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('Case Setup Page', () => {
    beforeEach(() => {
        window.localStorage.clear();
        mockNavigate.mockClear();
    });

    test('should display the setup form', () => {
        const { getByText } = render(
            <I18nextProvider i18n={i18n}>
                <SetupScreen selectedLanguage="en" />
            </I18nextProvider>
        );
        expect(getByText('Set up')).toBeInTheDocument();
    });

    test('should show error messages for empty mandatory fields', () => {
        const { getByText } = render(
            <I18nextProvider i18n={i18n}>
                <SetupScreen selectedLanguage="en" />
            </I18nextProvider>
        );

        const saveButton = getByText('Save');
        fireEvent.click(saveButton);

        expect(getByText('First Name is required!')).toBeInTheDocument();
        expect(getByText('Last Name is required!')).toBeInTheDocument();
        expect(getByText('Date of Birth is invalid!')).toBeInTheDocument();
        expect(getByText('Case ID is required!')).toBeInTheDocument();
        expect(getByText('Court ID is required!')).toBeInTheDocument();
    });

    test('should save form data to localStorage and navigate', () => {
        const { getByPlaceholderText, getByText } = render(
            <I18nextProvider i18n={i18n}>
                <SetupScreen selectedLanguage="en" />
            </I18nextProvider>
        );

        const firstNameInput = getByPlaceholderText('First Name');
        const lastNameInput = getByPlaceholderText('Last Name');
        const dobInput = getByPlaceholderText('DD/MM/YYYY');
        const caseIdInput = getByPlaceholderText('Case ID');
        const courtIdInput = getByPlaceholderText('Court ID');
        const saveButton = getByText('Save');

        fireEvent.change(firstNameInput, { target: { value: 'John' } });
        fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
        fireEvent.change(dobInput, { target: { value: '2000-01-01' } });
        fireEvent.change(caseIdInput, { target: { value: '123' } });
        fireEvent.change(courtIdInput, { target: { value: '456' } });
        fireEvent.click(saveButton);

        const savedCases = JSON.parse(window.localStorage.getItem('activeCases'));
        expect(savedCases).toHaveLength(1);
        expect(savedCases[0].firstName).toBe('John');
        expect(savedCases[0].lastName).toBe('Doe');
        expect(savedCases[0].dob).toBe('2000-01-01');
        expect(savedCases[0].caseId).toBe('123');
        expect(savedCases[0].courtId).toBe('456');
        expect(mockNavigate).toHaveBeenCalledWith('/avatar');
    });

    test('should load existing case data from localStorage if passed via location state', () => {
        // Set up localStorage with a case
        const caseData = {
            caseId: '123',
            firstName: 'John',
            lastName: 'Doe',
            dob: '2000-01-01',
            courtId: '456',
            enabledModules: ['aboutMe', 'myJourney']
        };
        localStorage.setItem('activeCases', JSON.stringify([caseData]));

        const { getByPlaceholderText } = render(
            <I18nextProvider i18n={i18n}>
                <SetupScreen selectedLanguage="en" />
            </I18nextProvider>
        );

        expect(getByPlaceholderText('First Name').value).toBe('John');
        expect(getByPlaceholderText('Last Name').value).toBe('Doe');
        expect(getByPlaceholderText('DD/MM/YYYY').value).toBe('2000-01-01');
        expect(getByPlaceholderText('Case ID').value).toBe('123');
        expect(getByPlaceholderText('Court ID').value).toBe('456');
    });
});
