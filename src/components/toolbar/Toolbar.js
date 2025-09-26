import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDrag } from 'react-dnd';
import './Toolbar.css';
import tools, {pencilColors} from './tools';
import { v4 as uuidv4 } from 'uuid';

// import tab-bar icons
import stickerIcon from './icons/tab-icons/stickers-icon.png';
import pencilIcon from './icons/tab-icons/pencil-icon.png';
import barIcon from './icons/tab-icons/bar-icon.png';
import ttIcon from './icons/tab-icons/tt-icon.png';
import emojiIcon from './icons/tab-icons/emoji-icon.png';
import peopleIcon from './icons/tab-icons/people-icon.png';
import animalsIcon from './icons/tab-icons/animals-icon.png';
import buildingsIcon from './icons/tab-icons/buildings-icon.png';

// import previous and next button assets
import showLeftIcon from '../toolbar/icons/show-left.png';
import showRightIcon from '../toolbar/icons/show-right.png';

// import sound files
import dragSoundFile from '../../assets/audio/pop.wav';

//import for sliders
import SliderIcon from '../../components/slider/SliderIcon';
import PencilIcon from './PencilIcon';

//import for pencils
import { STROKE_LARGE, STROKE_MEDIUM, STROKE_SMALL } from '../../lib/PenProperties';


const Toolbar = ({ selectedCategory, setSelectedCategory, onPencilChange, onFontChange, onSizeChange, onColorChange }) => {
  const { t } = useTranslation();
  const [startIndex, setStartIndex] = useState(0);
  const [showLaterCategories, setShowLaterCategories] = useState(true);

  // States for Post-It note options
  const [selectedFont, setSelectedFont] = useState('Calibri');
  const [selectedSize, setSelectedSize] = useState(14);
  const [selectedColor, setSelectedColor] = useState('#ff595e');

  // Handle changes to font, size, and color
  const handleFontChange = (font) => {
    setSelectedFont(font);
    if (onFontChange) onFontChange(font);
  };

  const handleSizeChange = (size) => {
    setSelectedSize(size);
    if (onSizeChange) onSizeChange(size);
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);
    if (onColorChange) onColorChange(color);
  };


  // Define the categories and their properties
  const categories = useMemo(() => [
      { name: 'Stickers', icon: stickerIcon, color: '164,83,159', class: 'first-four' },
      { name: 'Category2', icon: pencilIcon, color: '100,178,197', class: 'first-four' },
      { name: 'PostIt', icon: ttIcon, color: '178,196,83', class: 'first-four' },
      { name: 'Sliders', icon: barIcon, color: '178,72,67', class: 'first-four' },
    ...(showLaterCategories ? [
            { name: 'Emoji', icon: emojiIcon, color: '164,83,159', class: 'later-four' },
            { name: 'People', icon: peopleIcon, color: '164,83,159', class: 'later-four' },
            { name: 'Animals', icon: animalsIcon, color: '164,83,159', class: 'later-four' },
            { name: 'Buildings', icon: buildingsIcon, color: '164,83,159', class: 'later-four' },
    ] : [])
  ], [showLaterCategories]);

  // Set default selected category if none is selected
  useEffect(() => {
    if (!selectedCategory) {
      // setSelectedCategory('Emoji');
    }
  }, [selectedCategory, setSelectedCategory]);

  // Handle click event to navigate to the previous set of tools
  const handlePrevClick = () => {
    setStartIndex(Math.max(startIndex - 10, 0));
  };

  // Handle click event to navigate to the next set of tools
  const handleNextClick = () => {
    if (selectedCategory && tools[selectedCategory]) {
      if (selectedCategory === "Sliders") { //Different for sliders as 10 sliders per page would be too long
        setStartIndex(Math.min(startIndex + 5, tools[selectedCategory].length - 5));
        return
      }
      setStartIndex(Math.min(startIndex + 10, tools[selectedCategory].length - 10));
    }
  };

  // Handle category selection and update the selected category
  const handleCategoryClick = (category) => {
    if (category.name === selectedCategory) {
      setSelectedCategory(false)
      return
    }

    if (category.name === 'Stickers') {
      setSelectedCategory('Emoji');
    } else {
      setSelectedCategory(category.name);
    }
    setStartIndex(0);
    if (category.name === 'Stickers') {
      setShowLaterCategories(true);
    } else if (['Category2', 'PostIt', 'Sliders'].includes(category.name)) {
      setShowLaterCategories(false);
    }
  };

  // Component for draggable tool buttons
  const DraggableToolButton = ({ tool }) => {
    const dragSound = new Audio(dragSoundFile);
    dragSound.volume = 0.1;

    const [{ isDragging }, drag] = useDrag(() => ({
      type: 'sticker',
      item: () => {
        dragSound.play();
        return { id: uuidv4(), icon: tool.icon, name: tool.name };
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }));

    return (
      <button
        ref={drag}
        className="tool-button"
        style={{ opacity: isDragging ? 0.5 : 1 }}
      >
        {tool.icon ? (
          <img src={tool.icon} alt={tool.name} className="tool-icon" />
        ) : (
          tool.name
        )}
      </button>
    );
  };

  // Component for draggable tool buttons
  const DraggableSliders = ({ slider }) => {
    const dragSound = new Audio(dragSoundFile);
    dragSound.volume = 0.1;
    const [{ isDragging }, drag] = useDrag(() => ({
      type: 'slider',
      item: () => {
        dragSound.play();
        return { id: uuidv4(), ...slider, type: "slider" };
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }));
    return (
      <button
        ref={drag}
        className="tool-button"
        style={{ opacity: isDragging ? 0.5 : 1 }}
      >
        <SliderIcon slider={slider} disableClick={true}/>
      </button>
    );
  };

  // Constants for choosing a pencil
  const[selectedPencil, setSelectedPencil] = useState({color: 0, stroke: 10});
  useEffect(()=>{
    onPencilChange({...selectedPencil})
  }, [selectedPencil])

  const selectPencil = (e) => {
    let color = e.target.title==="eraser" ? "eraser" : parseInt(e.target.title)
    setSelectedPencil({...selectedPencil, color: color})
  }
  const setPencilStroke = (e) => {
    setSelectedPencil({...selectedPencil, stroke: parseInt(e.target.value)})
  }
  function renderToolbarIcons(selectedCategory, tools){
    /** Moved the rendering of toolbar icons for the html to here so it is easier to debug */
    const SLICE = 10; //Amount of icons to show in toolbar

    if (selectedCategory === "Sliders") {
      return tools[selectedCategory]
        .slice(startIndex, startIndex + SLICE/2)
        .map((tool, index) => <DraggableSliders key={index} slider={tool}/> 
      )
    }
    else if (selectedCategory === "Category2") { //Category2 = Pencils
      return (  <div className='pencilWrapper' key={selectedPencil}>
          <div className='pencilsWrapper'>
            {tools[selectedCategory].map((tool, index) => (
              <PencilIcon value={index} key={index} src={tool.value} onClick={selectPencil} disabled={index === selectedPencil.color ? true : false}/>
            ))}
          </div>
          <div className='strokeSizeWrapper'>
            <button className={`strokeOption ${selectedPencil.stroke === STROKE_LARGE ? "strokeSelected" : ""}`} style={{width: "70px", height: "70px", backgroundColor : pencilColors[selectedPencil.color]}} onClick={setPencilStroke} value={STROKE_LARGE}></button>  
            <button className={`strokeOption ${selectedPencil.stroke === STROKE_MEDIUM ? "strokeSelected" : ""}`} style={{width: "55px", height: "55px", backgroundColor : pencilColors[selectedPencil.color]}} onClick={setPencilStroke} value={STROKE_MEDIUM}></button>  
            <button className={`strokeOption ${selectedPencil.stroke === STROKE_SMALL ? "strokeSelected" : ""}`} style={{width: "40px", height: "40px", backgroundColor : pencilColors[selectedPencil.color]}} onClick={setPencilStroke} value={STROKE_SMALL}></button>  
          </div>
          <button className='drawing-erasor' disabled={selectedPencil.color === "eraser"} title={"eraser"} onClick={selectPencil}></button>
        </div>
      );
    } else if (selectedCategory === 'PostIt') {
      return (
        <div className="postit-toolbar">
          <div className="postit-font-options">
            <button 
              className={`postit-option ${selectedFont === 'Calibri' ? 'selected' : ''}`}
              onClick={() => handleFontChange('Calibri')}>
              Calibri
            </button>
            <button 
              className={`postit-option ${selectedFont === 'Arial' ? 'selected' : ''}`}
              onClick={() => handleFontChange('Arial')}>
              Arial
            </button>
            <button 
              className={`postit-option ${selectedFont === 'Comic Sans MS' ? 'selected' : ''}`}
              onClick={() => handleFontChange('Comic Sans MS')}>
              Comic Sans MS
            </button>
          </div>
          <div className="postit-size-options">
            {[10, 12, 14, 18, 24].map((size) => (
              <button 
                key={size} 
                className={`postit-option ${selectedSize === size ? 'selected' : ''}`}
                onClick={() => handleSizeChange(size)}>
                {size}
              </button>
            ))}
          </div>
          <div className="postit-color-options">
            {['#ff595e', '#ffca3a', '#8ac926', '#1982c4', '#6a4c93', '#b5179e', '#f48c06'].map((color) => (
              <button 
                key={color} 
                className="postit-option postit-color"
                style={{ backgroundColor: color }}
                onClick={() => handleColorChange(color)}>
              </button>
            ))}
          </div>
        </div>
      );
    } else {
      return tools[selectedCategory]
        .slice(startIndex, startIndex + SLICE)
      .map((tool, index) => (<DraggableToolButton key={index} tool={tool}/>)
    );
    }
  }

  return (
    <div className="toolbar-container">
      <div className="toolbar">
        <div className="toolbar-left">
          {categories.filter(category => category.class === 'first-four').map((category, index) => (
              <button
                key={index}
                className={`toolbar-button ${category.class} ${selectedCategory === category.name ? 'selected' : ''}`}
                style={{ backgroundColor: `rgba(${category.color}, 1)` }}
                onClick={() => handleCategoryClick(category)}
              >
              {category.icon ? (
                <img src={category.icon} alt={t(category.name)} className="toolbar-icon" />
              ) : (
                t(category.name)
              )}
              </button>
            ))}
        </div>
        <div className={`toolbar-right ${showLaterCategories ? '' : 'hidden'}`}>
          {categories.filter(category => category.class === 'later-four').map((category, index) => (
              <button
                key={index}
                className={`toolbar-button ${category.class} ${selectedCategory === category.name ? 'selected' : ''}`}
                style={{ backgroundColor: `rgba(${category.color}, 1)` }}
                onClick={() => handleCategoryClick(category)}
              >
              {category.icon ? (
                <img src={category.icon} alt={t(category.name)} className="toolbar-icon" />
              ) : (
                t(category.name)
              )}
              </button>
            ))}
        </div>
      </div>
      {selectedCategory && tools[selectedCategory] && (
        <div className="tools" id="toolbar-area">
          <button className="nav-button" onClick={handlePrevClick}>
            <img className="nav-button-img" src={showLeftIcon} alt="Previous" />
          </button>

          {renderToolbarIcons(selectedCategory, tools)} {/**MOVED THE RENDERING TO THE FUNCTION */}

          <button className="nav-button" onClick={handleNextClick}>
            <img className="nav-button-img" src={showRightIcon} alt="Next" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Toolbar;