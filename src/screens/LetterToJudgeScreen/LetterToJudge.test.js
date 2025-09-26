import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';
import LetterToJudge from './LetterToJudge';

test('renders introductory text and buttons', () => {
  const selectedLanguage = 'en';
  i18n.init({
    resources: {
      en: {
        translation: {
          "Nudds letter to the judge": "Nudd's letter to the judge",
          "There is a big decision the family court will make for you. You can tell the judge what you think should happen.": "There is a big decision the family court will make for you. You can tell the judge what you think should happen.",
          "Write a letter": "Write a letter",
          "Write a letter with help": "Write a letter with help",
          "Not Now": "Not Now"
        }
      }
    },
    lng: selectedLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

  render(
    <I18nextProvider i18n={i18n}>
      <Router>
        <LetterToJudge selectedLanguage={selectedLanguage} />
      </Router>
    </I18nextProvider>
  );

  const introElement = screen.getByText("There is a big decision the family court will make for you. You can tell the judge what you think should happen.");
  expect(introElement).toBeInTheDocument();

  const writeLetterButton = screen.getByText('Write a letter');
  expect(writeLetterButton).toBeInTheDocument();

  const writeLetterHelpButton = screen.getByText('Write a letter with help');
  expect(writeLetterHelpButton).toBeInTheDocument();

  const notNowButton = screen.getByText('Not Now');
  expect(notNowButton).toBeInTheDocument();
});
