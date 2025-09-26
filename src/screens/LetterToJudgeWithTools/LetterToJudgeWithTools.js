import React, { useState, useRef, useEffect } from 'react';
import './LetterToJudgeWithTools.css';
import judge from '../../assets/images/judge.png';
import { useNavigate, useLocation } from 'react-router-dom';
import buttonClick from '../../assets/audio/button_click.wav';
import { useTranslation } from 'react-i18next';
import DisplayUserAvatar from '../AvatarScreen/DisplayUserAvatar';
import html2canvas from 'html2canvas';
import { v4 as uuidv4 } from 'uuid';
import clickSoundFile from '../../assets/audio/click.mp3';
import { useDrop } from 'react-dnd';
import Toolbar from '../../components/toolbar/Toolbar';
import DraggableSticker from '../../components/toolbar/DraggableSticker';
import DraggableSlider from '../../components/toolbar/DraggableSlider';
import DraggablePostIt from '../../components/toolbar/DraggablePostIt';
import DrawingCanvas from '../../components/toolbar/drawing/DrawingCanvas';
import PenToMouse from '../../components/toolbar/drawing/PenToMouse';
import Button from '../../components/button';
import { btnBlue1 } from '../../assets/images/ui';
import ConfirmPopup from '../../components/ConfirmPopup';
import popSoundFile from '../../assets/audio/pop.wav';

const LetterToJudgeWithTools = ({ selectedLanguage }) => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const storedAvatar = JSON.parse(localStorage.getItem('avatar')) || { name: '', head: 0, torso: 0, legs: 0 };
    const [avatar, setAvatar] = useState(location.state?.avatar || storedAvatar);
    const [letterContent, setLetterContent] = useState(localStorage.getItem('letterToJudgeWithTools') || '');
    const [showPopup, setShowPopup] = useState(false);
    const [popupShown, setPopupShown] = useState(false);
    const audio = new Audio(buttonClick);
    audio.volume = 0.1;
    const Popfile = new Audio(popSoundFile);
    Popfile.volume = 0.1;

    const storedStickers = JSON.parse(localStorage.getItem('letterdroppedStickers')) || [];
    const storedSliders = JSON.parse(localStorage.getItem('letterdroppedSliders')) || [];
    const storedActions = JSON.parse(localStorage.getItem("letteractionHistory")) || [];
    const storedNotes = JSON.parse(localStorage.getItem("letterdroppedNotes")) || [];

    const [selectedCategory, setSelectedCategory] = useState('');
    const [letteractionHistory, setActionHistory] = useState(storedActions);
    const [letterdroppedStickers, setDroppedStickers] = useState(storedStickers);
    const [letterdroppedSliders, setDroppedSliders] = useState(storedSliders);
    const [letterdroppedNotes, setDroppedNotes] = useState(storedNotes);

    const [showHelpModal, setShowHelpModal] = useState(false);

    function saveOnLeavePage() {
        localStorage.setItem('letteractionHistory', JSON.stringify(letteractionHistory));
        localStorage.setItem('letterdroppedNotes', JSON.stringify(letterdroppedNotes));
    }

    useEffect(() => {
        i18n.changeLanguage(selectedLanguage);
    }, [selectedLanguage, i18n]);

    useEffect(() => {
        if (location.state?.avatar) {
            setAvatar(location.state.avatar);
        }
    }, [location.state]);

    useEffect(() => {
        localStorage.setItem('letterdroppedStickers', JSON.stringify(letterdroppedStickers));
        localStorage.setItem('letteractionHistory', JSON.stringify(letteractionHistory));
    }, [letterdroppedStickers]);

    useEffect(() => {
        localStorage.setItem('letterdroppedSliders', JSON.stringify(letterdroppedSliders));
        localStorage.setItem('letteractionHistory', JSON.stringify(letteractionHistory));
    }, [letterdroppedSliders]);

    useEffect(() => {
        localStorage.setItem('letterdroppedNotes', JSON.stringify(letterdroppedNotes));
        localStorage.setItem('letteractionHistory', JSON.stringify(letteractionHistory));
    }, [letterdroppedNotes]);

    const handleChange = (event) => {
        const textarea = event.target;
        const content = textarea.value;
        setLetterContent(content);
        localStorage.setItem('letterToJudgeWithTools', content);
        adjustFontSize(textarea);
    };
    useEffect(() => {
        const savedLetter = localStorage.getItem('letterToJudgeWithTools');
        if (savedLetter) {
          setLetterContent(savedLetter);
        } else {
          setLetterContent(''); // Clear the letter if no saved data
        }
    }, []);
    const adjustFontSize = (textarea) => {
        const maxHeight = parseInt(window.getComputedStyle(textarea).getPropertyValue('height'), 10);
        const initialFontSize = 1.5;
        let fontSize = parseFloat(window.getComputedStyle(textarea).getPropertyValue('font-size'));

        while (textarea.scrollHeight > maxHeight && fontSize > 1) {
            fontSize -= 0.1;
            textarea.style.fontSize = `${fontSize}px`;
        }

        while (textarea.scrollHeight <= maxHeight && fontSize < initialFontSize * 16) {
            fontSize += 0.1;
            textarea.style.fontSize = `${fontSize}px`;
            if (textarea.scrollHeight > maxHeight) {
                fontSize -= 0.1;
                textarea.style.fontSize = `${fontSize}px`;
                break;
            }
        }
    };

    const captureScreenshot = async () => {
        const container = document.querySelector('.letter-tools-container');
 
        const canvas = await html2canvas(container, {
            allowTaint: true,
            foreignObjectRendering: true,
            scale: window.devicePixelRatio,
            useCORS: true,
            logging: true,
        });
        const screenshot = canvas.toDataURL();
        localStorage.setItem('LetterToJudgeWithToolSS', screenshot);    
    };

    const NextScreen = async () => {
        audio.play();
        if (letterContent && !popupShown) {
            setShowPopup(true);
            setPopupShown(true);
        } else {
            console.log('Letter content:', letterContent);
            await captureScreenshot();
            navigate('/final-comments');
        }
    };

    const PreviousScreen = async () => {
        audio.play();
        await captureScreenshot();
        navigate('/letter-to-judge');
    };

    const handleUndo = () => {
        audio.play();
        setLetterContent('');
        localStorage.removeItem('letterToJudgeWithTools');
    };

    const closePopup = () => {
        setShowPopup(false);
    };

    const handleDrop = (item, monitor) => {
        const delta = monitor.getSourceClientOffset();
        const container = document.querySelector('.letter-tools-container');
        
        if (!container) {
            console.error("Container element not found.");
            return;
        }
        
        const containerRect = container.getBoundingClientRect();
        
        if (!containerRect) {
            console.error("Container's bounding rectangle could not be obtained.");
            return;
        }
        
        const x = delta.x - containerRect.left;
        const y = delta.y - containerRect.top;
        
        // If the item is a note, update its position
        if (item.type === 'note') {
            setDroppedNotes(prevNotes =>
                prevNotes.map(note =>
                    note.id === item.id ? { ...note, x, y } : note
                )
            );
        } else if ('icon' in item) { // Handle Stickers
            setDroppedStickers(prevStickers => {
                const existingSticker = prevStickers.find(sticker => sticker.id === item.id);
                if (existingSticker) {
                    return prevStickers.map(sticker =>
                        sticker.id === item.id ? { ...sticker, x, y } : sticker
                    );
                }
                return [...prevStickers, { ...item, x, y }];
            });
        } else if ('trackType' in item) { // Handle Sliders
            setDroppedSliders(prevSliders => {
                const existingSlider = prevSliders.find(slider => slider.id === item.id);
                if (existingSlider) {
                    return prevSliders.map(slider =>
                        slider.id === item.id ? { ...slider, x, y } : slider
                    );
                }
                return [...prevSliders, { ...item, x, y }];
            });
        }
        
        // Trigger re-render
        setActionHistory(prev => [...prev, { ...item, x, y }]);
    };
    

    const handleScreenClick = (e) => {
        if (selectedCategory === "PostIt") {
            Popfile.play();
            const container = document.querySelector('.letter-tools-container');
            
            const buttonClassNames = [
                'postit-note',             // Class for Post-It note
                'move-button',             // Class for move button on Post-It note
                'delete-button',           // Class for delete button on Post-It note
                'navigation-button',  // Class for left navigation button
                'help-button', // Class for help button
                'toolbar-button',          // Class for toolbar buttons
                'tool-button',             // Class for tool buttons inside toolbar
                'nav-button',              // Class for navigation buttons in toolbar
                'drawing-erasor',          // Class for eraser button in drawing tools
                'strokeOption',            // Class for stroke size options in drawing tools
                'dw-clear-btn',            // Class for the clear button
                'dw-undo-btn',             // Class for the undo button
                'toolbar-container',       // Class for the toolbar container
                'toolbar',                 // Class for the main toolbar
                'tools',                   // Class for the tools section inside the toolbar
                'pencilWrapper',           // Class for the pencil wrapper in the toolbar
                'pencilsWrapper',          // Class for the pencils wrapper inside pencil tools
                'strokeSizeWrapper',       // Class for the stroke size wrapper in the toolbar
                'postit-toolbar',          // Class for the Post-It note toolbar
                'postit-font-options',     // Class for font options in Post-It note toolbar
                'postit-size-options',     // Class for size options in Post-It note toolbar
                'postit-color-options',    // Class for color options in Post-It note toolbar
                'help-modal-overlay',
                'postit-toolbar',
                'letter-warning-clear',
                'letter-clear-btn',
                'tools-letter-textarea'
              ];

              if (buttonClassNames.some(className => e.target.closest(`.${className}`))) {
                return; // Prevent creating a new note if clicked on an existing button
              }


            if (!container) {
                return;
            }
            const containerRect = container.getBoundingClientRect();

            if (!containerRect) {
                return;
            }

            const x = e.clientX - containerRect.left;
            const y = e.clientY - containerRect.top;

            const newNote = {
                id: uuidv4(),
                type: 'note',
                x: x,
                y: y,
                text: '',
                color: '#feff9c',
                font: selectedFont,
                size: selectedSize + 'px',
                textColor: selectedColor,
            };
            letteractionHistory.push({ ...newNote, creation: true });
            setDroppedNotes((prevNotes) => [...prevNotes, newNote]);
        }
    };

    const handleStickerDrop = (updatedSticker) => {
        setDroppedStickers((prevStickers) =>
            prevStickers.map((sticker) =>
                sticker.id === updatedSticker.id ? updatedSticker : sticker
            )
        );
    };

    const handleStickerDelete = (stickerId) => {
        letteractionHistory.push(letterdroppedStickers.findLast((sticker) => sticker.id === stickerId));
        setDroppedStickers((prevStickers) =>
            prevStickers.filter((sticker) => sticker.id !== stickerId)
        );
    };

    const handleSliderDrop = (updatedSlider) => {
        letteractionHistory.push(letterdroppedSliders.findLast((slider) => slider.id === updatedSlider));
        setDroppedSliders((prevSliders) =>
            prevSliders.map((slider) =>
                slider.id === updatedSlider.id ? updatedSlider : slider
            )
        );
    };

    const handleNoteDrop = (updatedNote) => {
        letteractionHistory.push(letterdroppedNotes.findLast((note) => note.id === updatedNote));
        setDroppedNotes((prevNotes) =>
            prevNotes.map((note) =>
                note.id === updatedNote.id ? updatedNote : note
            )
        );
    };

    const handleSliderValueChange = (updatedSlider) => {
        setDroppedSliders((prevSliders) =>
            prevSliders.map((slider) =>
                slider.id === updatedSlider.id ? updatedSlider : slider
            )
        );
    };

    const handleSliderDelete = (sliderId) => {
        letteractionHistory.push(letterdroppedSliders.findLast((slider) => slider.id === sliderId));
        setDroppedSliders((prevSliders) =>
            prevSliders.filter((slider) => slider.id !== sliderId)
        );
    };

    const undoDeleted = (itemId, setFunc) => {
        setFunc((list) =>
            list.filter((item) => item.id !== itemId)
        );
    };

    const handleNoteDelete = (noteId) => {
        setDroppedNotes((prevNotes) =>
            prevNotes.filter((note) => note.id !== noteId)
        );
    };

    const handleNoteTextChange = (noteId, text) => {
        setDroppedNotes((prevNotes) =>
            prevNotes.map((note) =>
                note.id === noteId ? { ...note, text } : note
            )
        );
    };

    const clickSound = new Audio(clickSoundFile);
    clickSound.volume = 0.1;

    const handleHelpButtonClick = () => {
        clickSound.play();
        setShowHelpModal(true);
    };

    const handleCloseHelpModal = () => {
        setShowHelpModal(false);
    };

    const [, drop] = useDrop({
        accept: ['sticker', "slider", "note"],
        drop: (item, monitor) => handleDrop(item, monitor),
    });

  const [clearWarning, setClearWarning] = useState(false);
  const btnClear = () => {
    clickSound.play()
    setClearWarning(true) //Triggers warning message
  }
  const clearWarningPop = (event) => {
    /* Enables the warning pop up */
    const userDrawingStorage = "userDrawing";
    setClearWarning(false)
    if (event) { //RESETS THE SCREEN, add other types here when they are added
      setDroppedSliders([]) //Deletes all dropped sliders from the screen
      setDroppedStickers([]) //Deletes all dropped stickers from the screen
      setDroppedNotes([])
      setActionHistory([]) //Deletes undo history
      drawRef.current.resetCanvas() //Clears draw area
      localStorage.removeItem(userDrawingStorage)

    }
  }

    const btnUndo = () => {
        clickSound.play();
        let lastAction = letteractionHistory.pop();
        if (lastAction === undefined) {
            drawRef.current.undo();
            return;
        }

        if (lastAction === "DrawStroke") {
            drawRef.current.undo();
            return;
        }

        if ("icon" in lastAction) {
            if ("x" in lastAction) {
                let sticker = letterdroppedStickers.find((sticker) => sticker.id === lastAction.id);
                if (sticker) {
                    handleStickerDrop(lastAction);
                } else {
                    setDroppedStickers([...letterdroppedStickers, lastAction]);
                }
            } else undoDeleted(lastAction.id, setDroppedStickers);
        } else if ("trackType" in lastAction) {
            if ("x" in lastAction) {
                let slider = letterdroppedStickers.find((slider) => slider.id === lastAction.id);
                if (slider) {
                    handleSliderDrop(lastAction);
                } else {
                    setDroppedSliders([...letterdroppedSliders, lastAction]);
                }
            } else undoDeleted(lastAction.id, setDroppedSliders);
        } else if (lastAction.type === 'note') {
            if (!lastAction.creation) {
                let note = letterdroppedNotes.find((note) => note.id === lastAction.id);
                if (note) {
                    handleNoteDrop(lastAction);
                } else {
                    setDroppedNotes([...letterdroppedNotes, lastAction]);
                }
            } else {
                undoDeleted(lastAction.id, setDroppedNotes);
            }
        }
    };

    const [selectedPencil, setSelectedPencil] = useState({ color: 0, stroke: 5 });
    const [isDrawingMode, setDrawingMode] = useState(false);
    useEffect(() => {
        if (selectedCategory === "Category2") {
            setDrawingMode(true);
        } else if (selectedCategory) {
            setDrawingMode(false);
        }
    }, [selectedCategory]);

    const drawRef = useRef();

    function getCanvas(canvas) {
        drawRef.current = canvas;
    }

    const handleStroke = (e) => {
        if (e.paths.length !== 1) {
            letteractionHistory.push("DrawStroke");
        }
    };

    const handlePencilChange = (e) => {
        setSelectedPencil({ ...e });
        if (drawRef.current) {
            drawRef.current.eraseMode(e.color === "eraser");
        }
    };

    const [selectedFont, setSelectedFont] = useState('Calibri');
    const [selectedSize, setSelectedSize] = useState(14);
    const [selectedColor, setSelectedColor] = useState('#000000');

    const handleFontChange = (font) => setSelectedFont(font);
    const handleSizeChange = (size) => setSelectedSize(size);
    const handleColorChange = (color) => setSelectedColor(color);

    return (
        <div className="letter-tools-container" onClick={handleScreenClick} ref={drop} style={{ position: 'relative' }}>
            <header>
                <div className="header">{avatar.name}{t('letter to the judge')}</div>
            </header>
            <main>
                <textarea
                    className="tools-letter-textarea"
                    value={letterContent}
                    onChange={handleChange}
                    placeholder={t('Start writing your letter to judge...')}
                />
                <DrawingCanvas
                    forwardRef={getCanvas}
                    storagePath="letteruserDrawing"
                    handleStroke={handleStroke}
                    pencilInfo={selectedPencil}
                    key={selectedPencil}
                    isActive={isDrawingMode}
                >
                    <PenToMouse isActive={isDrawingMode} pencilInfo={selectedPencil} />
                </DrawingCanvas>
                {letterdroppedStickers.map((sticker) => (
                    <DraggableSticker
                        key={sticker.id}
                        sticker={sticker}
                        onDrop={handleStickerDrop}
                        onDelete={handleStickerDelete}
                    />
                ))}
                {letterdroppedSliders.map((slider) => (
                    <DraggableSlider
                        key={slider.id}
                        slider={slider}
                        onDrop={handleSliderDrop}
                        onDelete={handleSliderDelete}
                        onValueChange={handleSliderValueChange}
                    />
                ))}
                {letterdroppedNotes.map((note) => (
                    <DraggablePostIt
                        key={note.id}
                        note={note}
                        onDrop={handleNoteDrop}
                        onDelete={handleNoteDelete}
                        onTextChange={handleNoteTextChange}
                        font={selectedFont}
                        size={selectedSize + 'px'}
                        color={selectedColor}
                    />
                ))}
            </main>
            <Toolbar
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                onPencilChange={handlePencilChange}
                onFontChange={handleFontChange}
                onSizeChange={handleSizeChange}
                onColorChange={handleColorChange}
            />
            <div className='letter-clear-btn'>
                <Button image={btnBlue1} text={t('Clear')} onClick={btnClear} fontSize='2em' />
                <Button image={btnBlue1} text={t('Undo') + ' ↩'} onClick={btnUndo} fontSize='2em' />
            </div>
            <div key={clearWarning} style={clearWarning ? {display: "block"} : {display: "none"}} className="letter-warning-clear">
                <ConfirmPopup onStateChange={clearWarningPop}/>
            </div>
            <div className="tools-Avatar">
                <DisplayUserAvatar head={avatar.head} torso={avatar.torso} leg={avatar.legs} />
            </div>
            <div className="tools-Judge">
                <img src={judge} alt="Character Right" />
            </div>

            {showPopup && (
                <div className="tools-popup">
                    <div className="tools-popup-content">
                        <span className="tools-close-button" onClick={closePopup}>×</span>
                        <p>{t('Check if you are happy with your letter. You can change it if you need to.')}</p>
                    </div>
                </div>
            )}

            <div className="navigation-button left" onClick={PreviousScreen}></div>
            <div className="navigation-button right" onClick={NextScreen}></div>
            <div className="help-button" onClick={handleHelpButtonClick}></div>
        </div>
    );
};

export default LetterToJudgeWithTools;
