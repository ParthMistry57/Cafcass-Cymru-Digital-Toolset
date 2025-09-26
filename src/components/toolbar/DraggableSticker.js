import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import './DraggableSticker.css';
import dragSoundFile from '../../assets/audio/pop.wav';
import deleteSoundFile from '../../assets/audio/woosh.wav';

// DraggableSticker component allows stickers to be dragged and dropped within the application.
const DraggableSticker = ({ sticker, onDrop, onDelete }) => {
  const [showCloseButton, setShowCloseButton] = useState(false); // State to manage the visibility of the close button

  // Create the Audio objects
  const dragSound = new Audio(dragSoundFile);
  dragSound.volume = 0.1;
  const deleteSound = new Audio(deleteSoundFile);
  deleteSound.volume = 0.1;
  
  // useDrag hook is used to make the sticker draggable.
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'sticker', // Specifies the type of draggable item.
    item: () => {
      dragSound.play();
      return { id: sticker.id, icon: sticker.icon, name: sticker.name, x: sticker.x, y: sticker.y }; // Data about the sticker being dragged.
    },
    end: (item, monitor) => {
      // This function is called when dragging ends.
      const delta = monitor.getDifferenceFromInitialOffset(); // Get the difference from the initial offset.
      if (delta) {
        const newX = item.x + delta.x; // Calculate new X position.
        const newY = item.y + delta.y;

        const toolbarContainer = document.querySelector('.toolbar-container');
        const toolbarRect = toolbarContainer.getBoundingClientRect();

        const headerContainer = document.querySelector('.direct-work-header, .make-wish-header, letter-tools-container');
        const headerRect = headerContainer.getBoundingClientRect();

        const leftButton = document.querySelector('.direct-work-navigation-button-left, .make-wish-navigation-button-left, navigation-button left');
        const leftButtonRect = leftButton.getBoundingClientRect();

        const rightButton = document.querySelector('.direct-work-navigation-button-right, .make-wish-navigation-button-right, navigation-button right');
        const rightButtonRect = rightButton.getBoundingClientRect();

        const helpButton = document.querySelector('.direct-work-help-button, .make-wish-help-button, help-button');
        const helpButtonRect = helpButton.getBoundingClientRect();

        // Check if the new position is within the toolbar container, header, navigation buttons, or help button
        if (
          (newX + toolbarContainer.offsetWidth > toolbarRect.left && newX < toolbarRect.right && newY + toolbarContainer.offsetHeight > toolbarRect.top && newY < toolbarRect.bottom) ||
          (newX + headerContainer.offsetWidth > headerRect.left && newX < headerRect.right && newY + headerContainer.offsetHeight > headerRect.top && newY < headerRect.bottom) ||
          (newX + leftButton.offsetWidth > leftButtonRect.left && newX < leftButtonRect.right && newY + leftButton.offsetHeight > leftButtonRect.top && newY < leftButtonRect.bottom) ||
          (newX + rightButton.offsetWidth > rightButtonRect.left && newX < rightButtonRect.right && newY + rightButton.offsetHeight > rightButtonRect.top && newY < rightButtonRect.bottom) ||
          (newX + helpButton.offsetWidth > helpButtonRect.left && newX < helpButtonRect.right && newY + helpButton.offsetHeight > helpButtonRect.top && newY < helpButtonRect.bottom)
        ) {
          return;
        }

        onDrop({ ...item, x: newX, y: newY }); // Update the position of the sticker.
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(), // Monitor the drag state.
    }),
  }), [sticker, onDrop]);

  const handleButtonClick = () => {
    dragSound.play(); // Play sound when the button is clicked
    setShowCloseButton(!showCloseButton); // Toggle the visibility of the close button
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    deleteSound.play(); // Play sound when the delete button is clicked
    onDelete(sticker.id);
  };

  return (
    <div
      ref={drag} // Attach the drag ref to make the element draggable.
      className="draggable-sticker" // Apply the CSS class for styling.
      style={{ opacity: isDragging ? 0.5 : 1, position: 'absolute', left: sticker.x, top: sticker.y }} // Apply styles for dragging effect and positioning.
      onClick={handleButtonClick} // Use handleButtonClick to toggle the close button and play sound
    >
      <img src={sticker.icon} alt={sticker.name} />
      {showCloseButton && (
        <button className="close-button" onClick={handleDeleteClick}>X</button>
      )}
    </div>
  );
};

export default DraggableSticker;