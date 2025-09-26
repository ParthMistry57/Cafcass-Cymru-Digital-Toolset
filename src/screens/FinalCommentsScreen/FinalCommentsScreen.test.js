import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FinalCommentsScreen from './FinalCommentsScreen';

// Mocking react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key, // Mock translation function, returns key as translation
    i18n: {
      changeLanguage: jest.fn(), // Mock changeLanguage function
    },
  }),
}));

// Mocking the useNavigate hook from react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

beforeEach(() => {
  // Mocking the audio play
  global.Audio = jest.fn().mockImplementation(() => ({
    play: jest.fn(),
  }));
  
  localStorage.clear();
});

describe('FinalCommentsScreen Component', () => {

  it('renders the component', () => {
    render(<FinalCommentsScreen />);
    expect(screen.getByText(/Feedback/i)).toBeInTheDocument();
  });

  it('handles rating change for feeling', () => {
    render(<FinalCommentsScreen />);
    
    const star = screen.getAllByText('★')[0];
    fireEvent.click(star);

    expect(star).toHaveClass('selected');
  });

  it('saves comments to localStorage and navigates on right button click', () => {
    const { container } = render(<FinalCommentsScreen />);

    const textarea = screen.getByPlaceholderText(/feedback_prompt/i);
    fireEvent.change(textarea, { target: { value: 'Great experience!' } });

    const rightButton = container.querySelector('.final-comments-right-button');
    fireEvent.click(rightButton);

    expect(localStorage.getItem('finalComments')).toBe('Great experience!');
    expect(mockNavigate).toHaveBeenCalledWith('/complete');
  });

  it('saves comments to localStorage and navigates on left button click', () => {
    const { container } = render(<FinalCommentsScreen />);

    const textarea = screen.getByPlaceholderText(/feedback_prompt/i);
    fireEvent.change(textarea, { target: { value: 'Great experience!' } });

    const leftButton = container.querySelector('.final-comments-left-button');
    fireEvent.click(leftButton);

    expect(localStorage.getItem('finalComments')).toBe('Great experience!');
    expect(mockNavigate).toHaveBeenCalledWith('/letter-to-judge');
  });

  it('loads saved comments and ratings from localStorage', () => {
    localStorage.setItem('finalComments', 'Saved comment');
    localStorage.setItem('finalRatings', JSON.stringify({ feeling: 3, ease: 4, understanding: 5 }));

    render(<FinalCommentsScreen />);

    const textarea = screen.getByPlaceholderText(/feedback_prompt/i);
    expect(textarea.value).toBe('Saved comment');

    const selectedStars = screen.getAllByText('★').filter(star => star.classList.contains('selected'));
    expect(selectedStars).toHaveLength(12); // 3 + 4 + 5 stars should be selected
  });
});