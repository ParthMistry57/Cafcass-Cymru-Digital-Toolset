import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LetterToJudgeWithHelp from './LetterToJudgeWithHelp';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';

describe('LetterToJudgeWithHelp', () => {
    const renderComponent = () => {
        render(
            <MemoryRouter>
                <I18nextProvider i18n={i18n}>
                    <LetterToJudgeWithHelp selectedLanguage="en" />
                </I18nextProvider>
            </MemoryRouter>
        );
    };

    it('renders the initial prompt and textarea', () => {
        renderComponent();
        expect(screen.getByText(/What would you like to stay the same?/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Type your response here.../i)).toBeInTheDocument();
    });

    it('shows the initial pop-up message', () => {
        renderComponent();
        expect(screen.getByText(/Write down what you would like to say to the judge./i)).toBeInTheDocument();
    });

    it('hides the pop-up when the close button is clicked', () => {
        renderComponent();
        const closeButton = screen.getByText('×');
        fireEvent.click(closeButton);
        expect(screen.queryByText(/Write down what you would like to say to the judge./i)).not.toBeInTheDocument();
    });
});