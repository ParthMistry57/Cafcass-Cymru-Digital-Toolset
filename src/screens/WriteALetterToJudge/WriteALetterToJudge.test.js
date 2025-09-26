import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import WriteALetterToJudge from './WriteALetterToJudge';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';

describe('WriteALetterToJudge', () => {
    const renderComponent = (language = 'en') => {
        return render(
            <BrowserRouter>
                <I18nextProvider i18n={i18n}>
                    <WriteALetterToJudge selectedLanguage={language} />
                </I18nextProvider>
            </BrowserRouter>
        );
    };

    test('renders the initial letter content placeholder', () => {
        renderComponent('en');
        const textareaElement = screen.getByPlaceholderText(/Start writing your letter to judge.../i);
        expect(textareaElement).toBeInTheDocument();
    });

    test('allows the user to write a letter', () => {
        renderComponent('en');
        const textareaElement = screen.getByRole('textbox');
        fireEvent.change(textareaElement, { target: { value: 'New content for the letter' } });
        expect(textareaElement.value).toBe('New content for the letter');
    });
});
