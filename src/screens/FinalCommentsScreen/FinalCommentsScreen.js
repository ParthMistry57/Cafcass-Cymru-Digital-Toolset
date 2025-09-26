import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './FinalCommentsScreen.css';
import buttonClick from '../../assets/audio/button_click.wav';

const FinalCommentsScreen = ({ selectedLanguage, fontSize }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [comments, setComments] = useState('');
  const [ratings, setRatings] = useState({ feeling: 0, ease: 0, understanding: 0 });
  const audio = new Audio(buttonClick);
  audio.volume = 0.1;

  useEffect(() => {
    i18n.changeLanguage(selectedLanguage);
  }, [selectedLanguage, i18n]);

  useEffect(() => {
    const savedComments = localStorage.getItem('finalComments');
    const savedRatings = localStorage.getItem('finalRatings');
    if (savedComments) setComments(savedComments);
    if (savedRatings) setRatings(JSON.parse(savedRatings));
  }, []);

  const handleCommentsChange = (event) => {
    setComments(event.target.value);
  };

  const handleRatingChange = (question, rating) => {
    setRatings((prevRatings) => ({
      ...prevRatings,
      [question]: rating,
    }));
  };

  const handleRightButtonClick = () => {
    audio.play();
    localStorage.setItem('finalComments', comments);
    localStorage.setItem('finalRatings', JSON.stringify(ratings));
    navigate('/complete');
  };

  const handleLeftButtonClick = () => {
    audio.play();
    localStorage.setItem('finalComments', comments);
    localStorage.setItem('finalRatings', JSON.stringify(ratings));
    navigate('/letter-to-judge');
  };

  return (
    <div className="final-comments-container" style={{ fontSize: `${fontSize}em` }}>
      <div className="final-comments-title-container">
        <h1 className="final-comments-title">
          <span className='final-comments-title-line1'>{t('Feedback')}</span>
          <span className='final-comments-title-line2'>{t('how_was_your_experience')}</span>
        </h1>
      </div>
      <div className="final-comments-main-content">
        <button className="final-comments-left-button" onClick={handleLeftButtonClick}></button>
        <div className="final-comments-content">
          <div className="ratings-container">
            <div className="rating-question">
              <span className="feedback-ask">{t('how_did_you_feel')}</span>
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map((level) => (
                  <span
                    key={level}
                    className={`star ${ratings.feeling >= level ? 'selected' : ''}`}
                    onClick={() => handleRatingChange('feeling', level)}
                  >★</span>
                ))}
              </div>
            </div>
            <div className="rating-question">
              <span className="feedback-ask">{t('was_it_easy')}</span>
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map((level) => (
                  <span
                    key={level}
                    className={`star ${ratings.ease >= level ? 'selected' : ''}`}
                    onClick={() => handleRatingChange('ease', level)}
                  >★</span>
                ))}
              </div>
            </div>
            <div className="rating-question">
              <span className="feedback-ask">{t('did_it_help')}</span>
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map((level) => (
                  <span
                    key={level}
                    className={`star ${ratings.understanding >= level ? 'selected' : ''}`}
                    onClick={() => handleRatingChange('understanding', level)}
                  >★</span>
                ))}
              </div>
            </div>
          </div>
          <div className="final-comments-textarea-container">
            <textarea
              className="final-comments-textarea"
              placeholder={t('feedback_prompt')}
              value={comments}
              onChange={handleCommentsChange}
              rows={10}
            ></textarea>
          </div>
        </div>
        <button className="final-comments-right-button" onClick={handleRightButtonClick}></button>
      </div>
    </div>
  );
};

export default FinalCommentsScreen;