// src/screens/StartScreen/StartScreen.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';
import StartScreen from './StartScreen';

// Mock useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('StartScreen', () => {
  const mockNavigate = jest.fn();
  const mockOnLanguageChange = jest.fn();

  beforeEach(() => {
    require('react-router-dom').useNavigate.mockReturnValue(mockNavigate);
  });

  it('renders StartScreen correctly', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <MemoryRouter>
          <StartScreen selectedLanguage="en" onLanguageChange={mockOnLanguageChange} />
        </MemoryRouter>
      </I18nextProvider>
    );

    expect(screen.getByText(/how it looks to/i)).toBeInTheDocument();
    expect(screen.getByText(/me/i)).toBeInTheDocument();
    expect(screen.getByText(/start/i)).toBeInTheDocument();
  });

  it('changes language when language button is clicked', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <MemoryRouter>
          <StartScreen selectedLanguage="en" onLanguageChange={mockOnLanguageChange} />
        </MemoryRouter>
      </I18nextProvider>
    );

    fireEvent.click(screen.getByText('Cymraeg'));
    expect(mockOnLanguageChange).toHaveBeenCalledWith('cy');
  });

  it('navigates to final-comments on start button click', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <MemoryRouter>
          <StartScreen selectedLanguage="en" onLanguageChange={mockOnLanguageChange} />
        </MemoryRouter>
      </I18nextProvider>
    );

    fireEvent.click(screen.getByText('Start'));
    expect(mockNavigate).toHaveBeenCalledWith('/admin-dashboard');
  });
});