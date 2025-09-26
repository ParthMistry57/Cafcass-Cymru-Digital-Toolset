import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from '../../components/button';
import './CompleteScreen.css';
import DisplayUserAvatar from '../AvatarScreen/DisplayUserAvatar';
import Modal from 'react-modal';
import { jsPDF } from 'jspdf';
import buttonClick from '../../assets/audio/button_click.wav';

Modal.setAppElement('#root'); // Set the app element for react-modal

const CompleteScreen = ({ selectedLanguage, fontSize }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const audio = new Audio(buttonClick);
  audio.volume = 0.1;

  // Get avatar data from localStorage
  const storedAvatar = JSON.parse(localStorage.getItem('avatar')) || { name: '', head: 0, torso: 0, legs: 0 };
  const [avatar, setAvatar] = useState(location.state?.avatar || storedAvatar);

  // PDF export state
  const [isPdfExported, setIsPdfExported] = useState(false);

  // Get case setup data from localStorage
  const [setupData, setSetupData] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [confirmModalIsOpen, setConfirmModalIsOpen] = useState(false); // State for confirmation modal
  const [screenshot, setScreenshot] = useState([]);

  const [currentScreenshotIndex, setCurrentScreenshotIndex] = useState(0);
  const handlePrevious = () => {
    if (currentScreenshotIndex > 0) {
      setCurrentScreenshotIndex(currentScreenshotIndex - 1);
    }
  };
  
  const handleNext = () => {
    if (currentScreenshotIndex < screenshot.length - 1) {
      setCurrentScreenshotIndex(currentScreenshotIndex + 1);
    }
  };

  const [letterToJudge, setLetterToJudge] = useState(''); // To hold letter to judge data
  const [letterToJudgeWithHelp, setLetterToJudgeWithHelp] = useState(''); // To hold letter to judge with help data

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('activeCases')) || [];
    setSetupData(data);

    const savedLetter = localStorage.getItem('letterToJudge');
    if (savedLetter) {
      setLetterToJudge(savedLetter);
    }

    const savedLetterWithHelp = localStorage.getItem('responses');
    if (savedLetterWithHelp) {
      setLetterToJudgeWithHelp(JSON.parse(savedLetterWithHelp).join('\n\n'));
    }
  }, []);

  useEffect(() => {
    const screenshotData = localStorage.getItem('directWorkScreenshot');
    const wishScreenshotData = localStorage.getItem('wishScreenshot');
    const wishScreenshotData2 = localStorage.getItem('wishScreenshot2');
    const wishScreenshotData3 = localStorage.getItem('wishScreenshot3');
    const letterScreenshot = localStorage.getItem('writeLetterToJudgeScreenshot');
    const screenshotLJH0 = localStorage.getItem('screenshotLJH0');
    const screenshotLJH1 = localStorage.getItem('screenshotLJH1');
    const screenshotLJH2 = localStorage.getItem('screenshotLJH2');
    const screenshotLJH3 = localStorage.getItem('screenshotLJH3');
    const LetterToJudgeWithToolSS = localStorage.getItem('LetterToJudgeWithToolSS');
    

    const screenshotsArray = [];
    if (screenshotData) screenshotsArray.push({ label: 'About Me', src: screenshotData });
    if (wishScreenshotData) screenshotsArray.push({ label: 'Make a wish for now', src: wishScreenshotData });
    if (wishScreenshotData2) screenshotsArray.push({ label: 'Make a wish for future', src: wishScreenshotData2 });
    if (wishScreenshotData3) screenshotsArray.push({ label: 'Make a wish for the family', src: wishScreenshotData3 });

    // Add the Letter to Judge with Help screenshots only if they exist
    if (screenshotLJH0 && screenshotLJH1 && screenshotLJH2 && screenshotLJH3) {
      screenshotsArray.push(
        { label: 'Letter to the judge with help 1', src: screenshotLJH0 },
        { label: 'Letter to the judge with help 2', src: screenshotLJH1 },
        { label: 'Letter to the judge with help 3', src: screenshotLJH2 },
        { label: 'Letter to the judge with help 4', src: screenshotLJH3 }
      );
    } else if (letterScreenshot) {
      // Only add the writeLetterToJudgeScreenshot if the help screenshots do not exist
      screenshotsArray.push({ label: 'Letter to the judge', src: letterScreenshot });
    } else if (LetterToJudgeWithToolSS) {
      screenshotsArray.push({ label: 'Letter to the judge With Tools', src: LetterToJudgeWithToolSS });
    }

    setScreenshot(screenshotsArray);
}, []);

  useEffect(() => {
    i18n.changeLanguage(selectedLanguage);
  }, [selectedLanguage, i18n]);

  useEffect(() => {
    if (location.state?.avatar) {
      setAvatar(location.state.avatar);
    }
  }, [location.state]);

  const [finalComments, setFinalComments] = useState('');
  const [finalRatings, setFinalRatings] = useState({ feeling: 0, ease: 0, understanding: 0 });

  useEffect(() => {
    const savedFinalComments = localStorage.getItem('finalComments');
    if (savedFinalComments) {
      setFinalComments(savedFinalComments);
    }

    const savedFinalRatings = localStorage.getItem('finalRatings');
    if (savedFinalRatings) {
      setFinalRatings(JSON.parse(savedFinalRatings));
    }
  }, []);

  // Retrieve the current case from localStorage
  const [currentCase, setCurrentCase] = useState(null);

  useEffect(() => {
    const storedCurrentCase = JSON.parse(localStorage.getItem('currentCase'));
    if (storedCurrentCase) {
      setCurrentCase(storedCurrentCase);
    }
  }, []);

  const handleLeftButtonClick = async () => {
    audio.play();
    navigate('/final-comments');
  };

  const handleStartAgainButtonClick = () => {
    setConfirmModalIsOpen(true); // Open confirmation modal
  };

  const confirmStartAgain = () => {
   // Retrieve the currentCase from localStorage
  const currentCaseData = JSON.parse(localStorage.getItem('currentCase'));

  if (currentCaseData) {
    const { caseId, firstName, lastName } = currentCaseData;

    // Find and remove the case that matches all three attributes
    const updatedCases = setupData.filter(
      (caseData) =>
        !(caseData.caseId === caseId &&
          caseData.firstName === firstName &&
          caseData.lastName === lastName)
    );

    // Update localStorage with the filtered cases
    localStorage.setItem('activeCases', JSON.stringify(updatedCases));
    setSetupData(updatedCases);
  }

  
    // Remove other items from localStorage
    localStorage.removeItem('droppedStickers');
    localStorage.removeItem('droppedSliders');
    localStorage.removeItem('droppedNotes');
    localStorage.removeItem('userDrawing');
    localStorage.removeItem('letterToJudge');
    localStorage.removeItem('responses');
    localStorage.removeItem('finalComments');
    localStorage.removeItem('finalRatings');
    localStorage.removeItem('currentCase');
    localStorage.removeItem('wishdroppedStickers');
    localStorage.removeItem('wishdroppedSliders');
    localStorage.removeItem('wishdroppedStickers2');
    localStorage.removeItem('wishdroppedSliders2');
    localStorage.removeItem('wishdroppedStickers3');
    localStorage.removeItem('wishdroppedSliders3');
    localStorage.removeItem('wishdroppedNotes');
    localStorage.removeItem('wishuserDrawing');
    localStorage.removeItem('wishdroppedNotes2');
    localStorage.removeItem('wishuserDrawing2');
    localStorage.removeItem('wishdroppedNotes3');
    localStorage.removeItem('wishuserDrawing3');
    localStorage.removeItem('directWorkScreenshot');
    localStorage.removeItem('wishScreenshot');
    localStorage.removeItem('wishScreenshot2');
    localStorage.removeItem('wishScreenshot3');
    localStorage.removeItem('writeLetterToJudgeScreenshot');
    localStorage.removeItem('screenshotLJH0');
    localStorage.removeItem('screenshotLJH1');
    localStorage.removeItem('screenshotLJH2');
    localStorage.removeItem('screenshotLJH3');
    localStorage.removeItem('LetterToJudgeWithToolSS');
    localStorage.removeItem('letterToJudgeWithTools');
    localStorage.removeItem('letterdroppedStickers');
    localStorage.removeItem('letterdroppedSliders');
    localStorage.removeItem('letteractionHistory');
    localStorage.removeItem('letterdroppedNotes');
    localStorage.removeItem('letteruserDrawing');

    // Remove the current case
    // Close the confirmation modal and navigate to the admin dashboard
    setConfirmModalIsOpen(false);
    navigate('/admin-dashboard');
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const closeConfirmModal = () => {
    setConfirmModalIsOpen(false);
  };

  const clearLetterContent = () => {
    localStorage.removeItem('letterToJudge');
    setLetterToJudge(''); // Clear the state in CompleteScreen
  };

  // Helper function to load image asynchronously
  const loadImageAsync = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  };

  const handleSaveButtonClick = async () => {
    try {
      const doc = new jsPDF();
  
    // Function to calculate center position
    const centerText = (text, pageWidth) => {
      const textWidth = doc.getTextWidth(text);
      return (pageWidth - textWidth) / 2;
    };
  
    // Function to scale images to fit within specified dimensions
    const scaleImageToFit = (imgWidth, imgHeight, maxWidth, maxHeight) => {
      const aspectRatio = imgWidth / imgHeight;
      if (imgWidth > maxWidth) {
        imgWidth = maxWidth;
        imgHeight = maxWidth / aspectRatio;
      }
      if (imgHeight > maxHeight) {
        imgHeight = maxHeight;
        imgWidth = maxHeight * aspectRatio;
      }
      return { width: imgWidth, height: imgHeight };
    };
  
    // Add case data to the first page
    const addCaseDataToPDF = () => {
      const pageWidth = doc.internal.pageSize.getWidth();
  
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      const title = "Case Detail";
      const titleX = centerText(title, pageWidth);
      doc.text(title, titleX, 20);
  
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      const lastCase = setupData[setupData.length - 1];
      if (lastCase) {
        const caseId = `Case ID: ${lastCase.caseId}`;
        const courtId = `Court ID: ${lastCase.courtId}`;
        const firstName = `First Name: ${lastCase.firstName}`;
        const lastName = `Last Name: ${lastCase.lastName}`;
        const dob = `Date Of Birth: ${lastCase.dob}`;
        
        const lineHeight = 10;
        doc.text(caseId, 20, 40);
        doc.text(courtId, 20, 40 + lineHeight);
        doc.text(firstName, 20, 40 + lineHeight * 2);
        doc.text(lastName, 20, 40 + lineHeight * 3);
        doc.text(dob, 20, 40 + lineHeight * 4);
      }
    };
  
      // Add Direct Work images to the second page
      const addImagesToPDF = async (callback) => {
        doc.addPage(); // Start a new page for image
      
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const titleY = 20;
      const imageHeight = 80; // Maximum height for each image to fit within the page
      const maxImageWidth = pageWidth - 2 * margin; // Maximum image width considering the margins
  
      // Add the title for the second page
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      const title = "Direct Work";
      const titleX = centerText(title, pageWidth);
      doc.text(title, titleX, titleY);
      
        let yOffset = titleY + 30; // Start below the title

        // Loop through each screenshot (excluding the last one, which is for Letter To Judge)
        for (let index = 0; index < screenshot.length; index++) {
          try {
            const img = await loadImageAsync(screenshot[index].src);
            const { width, height } = scaleImageToFit(img.width, img.height, maxImageWidth, imageHeight);
            const xOffset = (pageWidth - width) / 2; // Center image horizontally

            // Add a new page if there’s not enough space for the image
            if (yOffset + height > pageHeight - margin) {
              doc.addPage();
              yOffset = margin; // Reset yOffset for new page

              // Add the title again on the new page if necessary
              doc.setFontSize(22);
              doc.setFont('helvetica', 'bold');
              const titleX = centerText('Direct Work', pageWidth);
              doc.text('Direct Work', titleX, titleY);
              yOffset += 30; // Move yOffset below the title
            }

            // Add image and update yOffset
            doc.addImage(img, 'JPEG', xOffset, yOffset, width, height);
            yOffset += height + 10; // Add space after each image

            // Add the label below the image
            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            const label = screenshot[index].label; // Use the label from the screenshots array
            const labelX = centerText(label, pageWidth);
            doc.text(label, labelX, yOffset);

            // Update yOffset for next image
            yOffset += 20; // Add some space below the label
          } catch (error) {
            console.error(`Failed to load image ${index}:`, error);
          }
        }
        callback();
      };

      // Add Feedback Summary to the next page
      const addFeedbackToPDF = () => {
        doc.addPage(); // Start a new page for feedback
      
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      const pageWidth = doc.internal.pageSize.getWidth();
      const title = "Feedback Summary";
      const titleX = centerText(title, pageWidth);
      doc.text(title, titleX, 20);
      
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      const feedbackText = [
          `How did you feel: ${finalRatings.feeling} stars`,
          `Was it easy: ${finalRatings.ease} stars`,
          `Did it help: ${finalRatings.understanding} stars`,
          `Comments: ${finalComments}`
      ];
      
      const margin = 20;
      let yOffset = 40;
      const lineHeight = 10;
      
      feedbackText.forEach((line) => {
          if (yOffset + lineHeight > doc.internal.pageSize.getHeight() - margin) {
              doc.addPage();
              yOffset = margin + lineHeight;
          }
          doc.text(line, margin, yOffset);
          yOffset += lineHeight;
        });
      };

      // Call functions to add content to the PDF in the correct order
      addCaseDataToPDF();
      await addImagesToPDF(() => {
        addFeedbackToPDF(); // Add feedback after the images

        // Save the PDF
        doc.save('Cafcass-case.pdf');
        // Enable the confirm button after exporting the PDF
        setIsPdfExported(true);
        clearLetterContent(); // Clear letter content after saving PDF
      });
    } catch (error) {
      console.error('Failed to create PDF:', error);
    }
  };

  return (
    <div className="complete-container" style={{ fontSize: `${fontSize}em` }}>
      <div className="complete-header">
        <h1 className="complete-title">{t('Complete')}</h1>
      </div>
      <div className="complete-main-content">
        <button className="final-comments-left-button" onClick={handleLeftButtonClick}></button>
        <div className='complete-avatar-display-container'>
          <DisplayUserAvatar head={avatar.head} torso={avatar.torso} leg={avatar.legs} /> {/* Show user avatar */}
          <div className='complete-text-bg'>{t("It's all finished!")}</div>
        </div>
        <div className="complete-button-container">
          <div className="complete-button-wrapper">
            <Button text={t('Save')} onClick={openModal} /> {/* Add Save Case button */}
            <Button text={t('Start Again')} onClick={handleStartAgainButtonClick} />
          </div>
        </div>
      </div>
<Modal
  isOpen={modalIsOpen}
  onRequestClose={closeModal}
  contentLabel="Save Case Modal"
  className="complete-modal"
  overlayClassName="complete-modal-overlay"
  style={{ content: { fontSize: `${fontSize}em` } }} // Apply font size to modal content
>
  <h2>{t('Summary')}</h2>
  <p>{t('Please confirm the content of your case with the images below, you can close the window and return at any time to change the information in your case. If everything is satisfactory, please export the PDF file via the Export button.')}</p>
  
  <div className="complete-modal-screenshot-container">
    {screenshot.length > 0 && (
      <div className="complete-screenshot">
        <h3>{screenshot[currentScreenshotIndex].label}</h3>
        <img src={screenshot[currentScreenshotIndex].src} alt={screenshot[currentScreenshotIndex].label} />
      </div>
    )}
  </div>
  
  <div className="complete-modal-button-group">
    <button 
      className="complete-modal-button" 
      onClick={handlePrevious}
      disabled={currentScreenshotIndex === 0}
    >
      {t('Previous')}
    </button>
    <button 
      className="complete-modal-button" 
      onClick={handleNext}
      disabled={currentScreenshotIndex === screenshot.length - 1}
    >
      {t('Next')}
    </button>
  </div>

  <div className="complete-modal-button-group">
    <button className="complete-modal-button" onClick={closeModal}>{t('Close')}</button>
    <button className="complete-modal-button complete-modal-button-primary" onClick={handleSaveButtonClick}>{t('Export')}</button>
  </div>
</Modal>
      <Modal
        isOpen={confirmModalIsOpen}
        onRequestClose={closeConfirmModal}
        contentLabel="Confirm Start Again Modal"
        className="complete-modal"
        overlayClassName="complete-modal-overlay"
        style={{ content: { fontSize: `${fontSize}em`, maxWidth: '500px'} }} // Apply font size to modal content
      >
        <h2>{t('Are you sure?')}</h2>
        <p>
          {t('This action cannot be undone.')}
          <br />
          {t('please_ensure')}
        </p>
        <div className="complete-modal-button-group">
          <button className="complete-modal-button" onClick={closeConfirmModal}>{t('Cancel')}</button>
          <button className="complete-modal-button complete-modal-button-primary" onClick={confirmStartAgain} disabled={!isPdfExported} > {t('Confirm')} </button>
        </div>
      </Modal>
    </div>
  );
};

export default CompleteScreen;
