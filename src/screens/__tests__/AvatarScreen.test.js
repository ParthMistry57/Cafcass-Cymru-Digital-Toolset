import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AvatarScreen from '../AvatarScreen/AvatarScreen';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';

// Mock useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('AvatarScreen', () => {
  test('renders language buttons and title', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <AvatarScreen />
      </I18nextProvider>
    );

    expect(screen.getByText('I LIKE TO BE CALLED:')).toBeInTheDocument();
  });
  
});