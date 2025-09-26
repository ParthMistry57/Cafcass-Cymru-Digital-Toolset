import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDrop } from 'react-dnd';
import html2canvas from 'html2canvas';
import DisplayUserAvatar from '../AvatarScreen/DisplayUserAvatar';
import Toolbar from '../../components/toolbar/Toolbar';
import DraggableSticker from '../../components/toolbar/DraggableSticker';
import DraggableSlider from '../../components/toolbar/DraggableSlider';
import HelpModal from '../../components/help/HelpModal1';
import './MakeAWishScreen.css';
import clickSoundFile from '../../assets/audio/click.mp3';
import buttonClick from '../../assets/audio/button_click.wav';
import wandSoundFile from '../../assets/audio/wand.wav';
import wandImage from '../../assets/images/wand.png';
import Button from '../../components/button';
import { btnBlue1, makeAWish } from '../../assets/images/ui';
import ConfirmPopup from '../../components/ConfirmPopup';
import DrawingCanvas from '../../components/toolbar/drawing/DrawingCanvas';
import PenToMouse from '../../components/toolbar/drawing/PenToMouse';
import { v4 as uuidv4 } from 'uuid';  // For generating unique IDs
import DraggablePostIt from '../../components/toolbar/DraggablePostIt';  // Import the new DraggablePostIt component
import popSoundFile from '../../assets/audio/pop.wav';

const MakeAWishScreen = ({ selectedLanguage }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const audio = new Audio(buttonClick);
  audio.volume = 0.1;

  const wandAudio = new Audio(wandSoundFile);
  wandAudio.volume = 0.1;

  const Popfile = new Audio(popSoundFile);
  Popfile.volume = 0.1;

  const storedAvatar = JSON.parse(localStorage.getItem('avatar')) || { name: '', head: 0, torso: 0, legs: 0 };
  const [avatar, setAvatar] = useState(location.state?.avatar || storedAvatar);

  const storedStickers = JSON.parse(localStorage.getItem('wishdroppedStickers')) || [];
  const storedSliders = JSON.parse(localStorage.getItem('wishdroppedSliders')) || [];
  const storedActions = JSON.parse(localStorage.getItem("wishactionHistory")) || [];
  const storedNotes = JSON.parse(localStorage.getItem("wishdroppedNotes")) || [];  // New state for notes
  const [selectedCategory, setSelectedCategory] = useState('');
  const [wishactionHistory, setActionHistory] = useState(storedActions)
  const [wishdroppedStickers, setDroppedStickers] = useState(storedStickers);
  const [wishdroppedSliders, setDroppedSliders] = useState(storedSliders);
  const [wishdroppedNotes, setDroppedNotes] = useState(storedNotes);  // New state for notes

  const [showHelpModal, setShowHelpModal] = useState(false);

  function saveOnLeavePage(){
    localStorage.setItem('wishactionHistory', JSON.stringify(wishactionHistory));
    localStorage.setItem('wishdroppedNotes', JSON.stringify(wishdroppedNotes));  
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
    localStorage.setItem('wishdroppedStickers', JSON.stringify(wishdroppedStickers));
    localStorage.setItem('wishactionHistory', JSON.stringify(wishactionHistory)); //Updates the saved wishactionHistory
  }, [wishdroppedStickers]);
  useEffect(() => {
    localStorage.setItem('wishdroppedSliders', JSON.stringify(wishdroppedSliders));
    localStorage.setItem('wishactionHistory', JSON.stringify(wishactionHistory));
  }, [wishdroppedSliders]);
  useEffect(() => {
    localStorage.setItem('wishdroppedNotes', JSON.stringify(wishdroppedNotes));
    localStorage.setItem('wishactionHistory', JSON.stringify(wishactionHistory));
  }, [wishdroppedNotes]);

  const handleLeftButtonClick = () => {
    audio.play();
    saveOnLeavePage();
    navigate('/direct-work');
  };

  const handleRightButtonClick = () => {
    audio.play();
    saveOnLeavePage()
    navigate('/make-a-wish-future');
  }

  const handleMakeWishes = async () => {
    wandAudio.play();

    const wandElement = document.querySelector('.wand-animation');
    wandElement.style.display = 'block';

    // Trigger wand animation
    wandElement.style.animation = 'wandMove 1s linear';

    // Wait for animation to end before proceeding
    setTimeout(async () => {
      const container = document.querySelector('.make-wish');
      if (container) {
        const canvas = await html2canvas(container);
        const wishscreenshot = canvas.toDataURL();
        localStorage.setItem('wishScreenshot', wishscreenshot);
        saveOnLeavePage()
        navigate('/make-a-wish-future');
      }
    }, 1000); // Adjust timeout to match the wand animation duration
  };

  const handleDrop = (item, monitor) => {
    const delta = monitor.getSourceClientOffset();
    const container = document.querySelector('.make-wish-avatar-display-container');
    const containerRect = container.getBoundingClientRect();

    const toolbarContainer = document.querySelector('.toolbar-container');
    const toolbarRect = toolbarContainer.getBoundingClientRect();

    const headerContainer = document.querySelector('.make-wish-header');
    const headerRect = headerContainer.getBoundingClientRect();

    const leftButton = document.querySelector('.make-wish-navigation-button-left');
    const leftButtonRect = leftButton.getBoundingClientRect();

    const rightButton = document.querySelector('.make-wish-navigation-button-right');
    const rightButtonRect = rightButton.getBoundingClientRect();

    const helpButton = document.querySelector('.make-wish-help-button');
    const helpButtonRect = helpButton.getBoundingClientRect();

    const x = delta.x - containerRect.left;
    const y = delta.y - containerRect.top;

    if (
      (delta.x > toolbarRect.left && delta.x < toolbarRect.right && delta.y > toolbarRect.top && delta.y < toolbarRect.bottom) ||
      (delta.x > headerRect.left && delta.x < headerRect.right && delta.y > headerRect.top && delta.y < headerRect.bottom) ||
      (delta.x > leftButtonRect.left && delta.x < leftButtonRect.right && delta.y > leftButtonRect.top && delta.y < leftButtonRect.bottom) ||
      (delta.x > rightButtonRect.left && delta.x < rightButtonRect.right && delta.y > rightButtonRect.top && delta.y < rightButtonRect.bottom) ||
      (delta.x > helpButtonRect.left && delta.x < helpButtonRect.right && delta.y > helpButtonRect.top && delta.y < helpButtonRect.bottom)
    ) {
      return;
    }
    /** @note whomever adds the next items for the post-its and text boxes, make sure you include a unique identifier in the IF statement below. Otherwise other types of draggable objects will end up being places in the same spot at the same time */
    wishactionHistory.push(item)
    if (item.type === 'note') {
      setDroppedNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === item.id ? { ...note, x, y } : note
        )
      );
    } else if ('icon' in item) { //this will prevent slider and stickers being placed together. Since Sticker has icon property and slider does not.
      
      setDroppedStickers((prevStickers) => {
        const existingSticker = prevStickers.find(sticker => sticker.id === item.id);
        if (existingSticker) {
          return prevStickers.map(sticker =>
            sticker.id === item.id ? { ...sticker, x, y } : sticker
          );
        }
        return [...prevStickers, { ...item, x, y }];
      });


    } else if ('trackType' in item) { //slider has trackType property, whereas other droppable objects do not.
      setDroppedSliders((prevSliders) => {
        const existingSlider = prevSliders.find(slider => slider.id === item.id);
        if (existingSlider) {
          return prevSliders.map(slider =>
            slider.id === item.id ? { ...slider, x, y } : slider
          );
        }
        return [...prevSliders, { ...item, x, y }];
      });
    }

  };


  const handleScreenClick = (e) => {
    if (selectedCategory === "PostIt") {
      Popfile.play();
      const container = document.querySelector('.make-wish-avatar-display-container');
      const containerRect = container.getBoundingClientRect();


      const buttonClassNames = [
      'postit-note',             // Class for Post-It note
      'move-button',             // Class for move button on Post-It note
      'delete-button',           // Class for delete button on Post-It note
      'direct-work-navigation-button-left',  // Class for left navigation button
      'direct-work-navigation-button-right', // Class for right navigation button
      'direct-work-help-button', // Class for help button
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
      'postit-toolbar'
    ];

    // Check if the click is on any of the buttons with the specified class names
    if (buttonClassNames.some(className => e.target.closest(`.${className}`))) {
      return; // Prevent creating a new note if clicked on an existing button
    }

      // Check if the click is on an existing Post-It note
      if (e.target.closest('.postit-note')) {
        return; // Prevent creating a new note if clicked on an existing one
      }
  
      const x = e.clientX - containerRect.left;
      const y = e.clientY - containerRect.top;

      const newNote = {
        id: uuidv4(),
        type: 'note',
        x: x,
        y: y,
        text: '',  // Empty text for the new post-it
        color: '#feff9c',  // Yellow background
        font: selectedFont, // Use the selected font
        size: selectedSize + 'px', // Use the selected size
        textColor: selectedColor, // Use the selected text color
      };
  
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
    wishactionHistory.push(wishdroppedStickers.findLast((sticker) => sticker.id === stickerId))
    setDroppedStickers((prevStickers) =>
      prevStickers.filter((sticker) => sticker.id !== stickerId)
    );
  };

  const handleSliderDrop = (updatedSlider) => {
    wishactionHistory.push(wishdroppedSliders.findLast((slider) => slider.id === updatedSlider))
    setDroppedSliders((prevSliders) =>
      prevSliders.map((slider) =>
        slider.id === updatedSlider.id ? updatedSlider : slider
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
    wishactionHistory.push(wishdroppedSliders.findLast((slider) => slider.id === sliderId))
    setDroppedSliders((prevSliders) =>
      prevSliders.filter((slider) => slider.id !== sliderId)
    );
  };

  const undoDeleted = (itemId, setFunc) => {
    setFunc((list) =>
      list.filter((item) => item.id !== itemId)
    );
  }

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


  const clickSound = new Audio(clickSoundFile); // Create Audio Object
  clickSound.volume = 0.1;

  const handleHelpButtonClick = () => {
    clickSound.play(); // Play click audio
    setShowHelpModal(true); // show help modal
  };

  const handleCloseHelpModal = () => {
    setShowHelpModal(false); // hide help modal
  };

  const [, drop] = useDrop({
    accept: ['sticker', "slider", "note"],
    drop: (item, monitor) => handleDrop(item, monitor),
  });

  const [clearWarning, setClearWarning] = useState(false);
  const btnClear = (event) => {
    clickSound.play()
    setClearWarning(true)
    
  }
  const clearWarningPop = (event) => {
    setClearWarning(false)
    if (event) { //RESETS THE SCREEN, add other types here when they are added
      setDroppedSliders([]) //Deletes all dropped sliders from the screen
      setDroppedStickers([]) //Deletes all dropped stickers from the screen
      setDroppedNotes([])
      setActionHistory([]) //Deletes undo history
      drawRef.current.resetCanvas() 
      localStorage.removeItem("wishuserDrawing")
    }
  }
  const btnUndo = () => {
    clickSound.play()
    let lastAction = wishactionHistory.pop()
    if (lastAction === undefined) {drawRef.current.undo(); return;} //No past actions

    if (lastAction==="DrawStroke") {
      //If last action was a drawing action
      drawRef.current.undo()
      return
    }
    // Checks the type of draggable object the lastAction was performed on, so it can call the correct function.
    /** @note PLEASE ADD NEW TYPES TO THIS LIST */

    if ("icon" in lastAction) { //Checks is about a sticker (has field icon)
      if ("x" in lastAction) { 
        //If field X exists, it was a delete action or move action
        let sticker = wishdroppedStickers.find((sticker) => sticker.id === lastAction.id )
        if (sticker) { 
          //If the sticker still exists on the page, then it was a move action
          handleStickerDrop(lastAction)
        }
        else {
          //If the sticker does not exist on the page then it is a create action
          setDroppedStickers([...wishdroppedStickers, lastAction])
        }
      }
      else undoDeleted(lastAction.id, setDroppedStickers)
    }
    else if ("trackType" in lastAction) { //checks is about a Slider
      if ("x" in lastAction) {
        let slider = wishdroppedStickers.find((slider) => slider.id === lastAction.id )
        if (slider) {
          handleSliderDrop(lastAction)
        }
        else {
          setDroppedSliders([...wishdroppedSliders, lastAction])
        }
     }
      else undoDeleted(lastAction.id, setDroppedSliders)
    }
    else if (lastAction.type === 'note') {
      setDroppedNotes((prevNotes) => [...prevNotes, lastAction]);
    }
    
  }
  /************************/

  /* Functions and constants related to the drawing features */
  const[selectedPencil, setSelectedPencil] = useState({color : 0, stroke: 5}); //Currently selected pencil
  const[isDrawingMode, setDrawingMode] = useState(false); //Is drawing allowed? (Activates when user selectedCategory is drawing)
  useEffect(() => {
    if (selectedCategory === "Category2") {
      setDrawingMode(true)
    } else if (selectedCategory) {
      setDrawingMode(false)
    }
    
  }, [selectedCategory]);
  const drawRef = useRef();

  function getCanvas(canvas) {
    /* Sets the drawRef to the canvas reference so that the buttons from this page can interact with it */
    drawRef.current = canvas;
  } 
  const handleStroke = (e) => {
    /* Recieves stroke event from the drawing, add it to action history */
    if (e.paths.length !== 1) {
      wishactionHistory.push("DrawStroke")
    }
  }
  const handlePencilChange = (e) => {
    /* When user clicks on a pencil in the toolbar */
    setSelectedPencil({...e})
    drawRef.current.eraseMode(e.color==="eraser")
  }

  /* End of function for drawing features */

  // State for font, size, and color
  const [selectedFont, setSelectedFont] = useState('Calibri');
  const [selectedSize, setSelectedSize] = useState(14);
  const [selectedColor, setSelectedColor] = useState('#000000');

  // Handle changes from the toolbar
  const handleFontChange = (font) => setSelectedFont(font);
  const handleSizeChange = (size) => setSelectedSize(size);
  const handleColorChange = (color) => setSelectedColor(color);
  return (
    <div className="make-wish"  onClick={handleScreenClick}>
      <div className="make-wish-header">
      <h1 className="make-wish-title">
          <span className='make-wish-title-line1'>{t('What')} {avatar.name} {t('wishes_for')} </span>
          <span className='make-wish-title-line2'>{t('this_is_my_wish_for_now')}</span>
          <span className='make-wish-title-line3'>{t('a_wish_for_now')}</span>
        </h1>
      </div>
      <div className="make-wish-help-button" onClick={handleHelpButtonClick}></div>
      <div className="make-wish-avatar-display-container" ref={drop} style={{ position: 'relative' }}>
        {/* CANVAS FOR DRAWING */}
        <DrawingCanvas forwardRef={getCanvas} storagePath='wishuserDrawing' handleStroke={handleStroke} pencilInfo={selectedPencil} key={selectedPencil} isActive={isDrawingMode}>
          <PenToMouse isActive={isDrawingMode} pencilInfo={selectedPencil}/>
        </DrawingCanvas>
        {/* ####### */}
        <DisplayUserAvatar head={avatar.head} torso={avatar.torso} leg={avatar.legs} hat={1} wand={1}/>
        <img src={wandImage} className="wand-animation" alt="Magic Wand" />
        {/* Stickers */}
        {wishdroppedStickers.map((sticker) => (
          <DraggableSticker
            key={sticker.id}
            sticker={sticker}
            onDrop={handleStickerDrop}
            onDelete={handleStickerDelete}
          />
        ))}
        {wishdroppedSliders.map((slider) => (
          <DraggableSlider
            key={slider.id}
            slider={slider}
            onDrop={handleSliderDrop}
            onDelete={handleSliderDelete}
            onValueChange={handleSliderValueChange}
          />
        ))}
        {wishdroppedNotes.map((note) => (
          <DraggablePostIt
            key={note.id}
            note={note}
            onDrop={(updatedNote) => handleDrop(updatedNote)}
            onDelete={handleNoteDelete}
            onTextChange={handleNoteTextChange}
            font={selectedFont} 
            size={selectedSize + 'px'} 
            color={selectedColor}
          />
        ))}
      </div>

      <div className="make-wish-navigation-button make-wish-navigation-button-left" onClick={handleLeftButtonClick}></div>
      <div className="make-wish-navigation-button make-wish-navigation-button-right" onClick={handleRightButtonClick}></div>

      <Toolbar 
        selectedCategory={selectedCategory} 
        setSelectedCategory={setSelectedCategory} 
        onPencilChange={handlePencilChange} 
        onFontChange={handleFontChange}
        onSizeChange={handleSizeChange}
        onColorChange={handleColorChange}
      />
      <HelpModal show={showHelpModal} onClose={handleCloseHelpModal} /> {/* Add HelpModal Component */}

      {/* Buttons for undo and clear */}
      <div className='dw-clear-btn'>
      <Button image={btnBlue1} text={t('Clear')} onClick={btnClear} fontSize='2em'/>
      <Button image={btnBlue1} text={t('Undo')+' ↩'}onClick={btnUndo} fontSize='2em'/>
      </div>
      <div key={clearWarning} style={clearWarning ? {display: "block"} : {display: "none"}} className="warning-clear">
        <ConfirmPopup onStateChange={clearWarningPop}/>
      </div>
      <div className="make-wish-button">
      <Button image={makeAWish} text={t('make_your_wish')} onClick={handleMakeWishes} scale={0.7} >
      </Button>
      </div>
    </div>
  );
};

export default MakeAWishScreen;