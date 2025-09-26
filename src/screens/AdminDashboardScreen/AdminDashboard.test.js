import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate
}));

describe('AdminDashboard', () => {
    beforeEach(() => {
        localStorage.setItem('activeCases', JSON.stringify([
            { caseId: '12345', firstName: 'John', lastName: 'Doe' },
            { caseId: '67890', firstName: 'Jane', lastName: 'Smith' }
        ]));
    });

    afterEach(() => {
        localStorage.removeItem('activeCases');
        mockNavigate.mockClear();
    });

    const renderComponent = (language = 'en') => {
        return render(
            <BrowserRouter>
                <I18nextProvider i18n={i18n}>
                    <AdminDashboard selectedLanguage={language} />
                </I18nextProvider>
            </BrowserRouter>
        );
    };

    test('renders the admin dashboard with active cases in English', () => {
        renderComponent('en');
       
        expect(screen.getByText('YOU HAVE UNFINISHED WORK')).toBeInTheDocument();
        expect(screen.getByText('Choose an open Case ID to continue, or open a New case')).toBeInTheDocument();
        expect(screen.getByText('12345 - John Doe')).toBeInTheDocument();
        expect(screen.getByText('67890 - Jane Smith')).toBeInTheDocument();
    });

    test('renders the admin dashboard with active cases in Welsh', () => {
        renderComponent('cy');
        
        expect(screen.getByText('MAE GENNYCH WAITH ANORFFEN')).toBeInTheDocument();
        expect(screen.getByText('Dewiswch ID Achos agored i barhau, neu agor Achos Newydd')).toBeInTheDocument();
        expect(screen.getByText('12345 - John Doe')).toBeInTheDocument();
        expect(screen.getByText('67890 - Jane Smith')).toBeInTheDocument();
    });

    test('navigates to setup screen on new case button click', () => {
        renderComponent('en');

        fireEvent.click(screen.getByText('New'));
        expect(mockNavigate).toHaveBeenCalledWith('/setup');
    });

    test('navigates to setup screen with case data on continue button click after selecting a case', () => {
        renderComponent('en');

        fireEvent.click(screen.getByText('12345 - John Doe'));

        fireEvent.click(screen.getByText('Continue'));
        expect(mockNavigate).toHaveBeenCalledWith('/setup', {
            state: { caseId: '12345', firstName: 'John', lastName: 'Doe' }
        });
    });

    test('navigates to configuration screen on configuration button click', () => {
        renderComponent('en');

        fireEvent.click(screen.getByText('Configuration'));
        expect(mockNavigate).toHaveBeenCalledWith('/configuration');
    });
});
