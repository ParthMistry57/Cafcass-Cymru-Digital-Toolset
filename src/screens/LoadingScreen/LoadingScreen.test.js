import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoadingScreen from './LoadingScreen';
import logo from '../../assets/images/logo.png';
import preloaderFG from '../../assets/images/preloaderFG.png';
import preloaderBG from '../../assets/images/preloaderBG.png';

describe('LoadingScreen component', () => {
  test('renders loading screen with progress bar', () => {
    render(<LoadingScreen progress={50} />);
    
    // Check if the logo is present
    const logoElement = screen.getByAltText('Logo');
    expect(logoElement).toBeInTheDocument();
    expect(logoElement).toHaveAttribute('src', logo);
    
    // Check if the progress bar background is present
    const progressBGElement = screen.getByAltText('Progress Bar Background');
    expect(progressBGElement).toBeInTheDocument();
    expect(progressBGElement).toHaveAttribute('src', preloaderBG);

    // Check if the progress bar foreground is present
    const progressFGElement = screen.getByAltText('Progress Bar Foreground');
    expect(progressFGElement).toBeInTheDocument();
    expect(progressFGElement).toHaveAttribute('src', preloaderFG);

    // Check if the progress text is correct
    const progressTextElement = screen.getByText('50%');
    expect(progressTextElement).toBeInTheDocument();

    // Check if the loading message is present
    const loadingMessageElement = screen.getByText('Loading...');
    expect(loadingMessageElement).toBeInTheDocument();
  });
});