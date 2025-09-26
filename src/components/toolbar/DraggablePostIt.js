import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import './DraggablePostIt.css';
import dragSoundFile from '../../assets/audio/pop.wav';
import deleteSoundFile from '../../assets/audio/woosh.wav';

const DraggablePostIt = ({ note, onDrop, onDelete, onTextChange, font, size, color }) => {
  const [showCloseButton, setShowCloseButton] = useState(false); // State to manage the visibility of the close button

  // Create the Audio objects
  const dragSound = new Audio(dragSoundFile);
  dragSound.volume = 0.1;
  const deleteSound = new Audio(deleteSoundFile);
  deleteSound.volume = 0.1;
  
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'note', // Specifies the type of draggable item.
    item: () => {
      dragSound.play();
      return { ...note }; // Data about the note being dragged.
    },
    end: (item, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset(); // Get the difference from the initial offset.
      if (delta) {
        const newX = item.x + delta.x; // Calculate new X position.
        const newY = item.y + delta.y;

        onDrop({ ...item, x: newX, y: newY }); // Update the position of the note.
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(), // Monitor the drag state.
    }),
  }), [note, onDrop]);

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    deleteSound.play(); // Play sound when the delete button is clicked
    onDelete(note.id);
  };

  const handleTextChange = (e) => {
    onTextChange(note.id, e.target.value);
  };

  return (
    <div
      ref={drag}
      className="postit-note"
      style={{
        top: note.y,
        left: note.x,
        opacity: isDragging ? 0.5 : 1,
        position: 'absolute',
        backgroundColor: note.color || color, // Use note.color or the passed color prop
      }}
    >
      <div className="postit-header">
        <button className="move-button">⇅</button>
        <button className="delete-button" onClick={handleDeleteClick}>X</button>
      </div>
      <textarea
        className="postit-text"
        style={{ fontFamily: font || note.font, fontSize: size || note.size, color: note.textColor || color }} // Apply the selected font, size, and color
        value={note.text}
        onChange={handleTextChange}
      ></textarea>
    </div>
  );
};

export default DraggablePostIt;
