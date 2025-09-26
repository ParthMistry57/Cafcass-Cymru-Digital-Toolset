import React, { useState, useEffect } from "react";
import { pencilColors } from "../tools";
import { ERASER_STROKE } from "../../../lib/PenProperties";

function PenToMouse({ pencilInfo, isActive = true }) {
  const [deviceType, setDeviceType] = useState("");
  const [isCursor, setCursor] = useState(isActive);

  //Listens to mouse position to know where to show pencil's tip
  useEffect(() => {
    if (isActive) {
      document.addEventListener("mousemove", move);
      document.addEventListener("touchmove", move);

      return () => {
        document.removeEventListener("mousemove", move);
        document.removeEventListener("touchmove", move);
      };
    }
  }, [isActive]);

  if (!isActive) return; //Does nothing if not activated

  const isTouchDevice = () => {
    //Checks if device is touch, needed for finding out cursor position for pencil tip
    try {
      document.createEvent("TouchEvent");
      setDeviceType("touch");
      return true;
    } catch (e) {
      setDeviceType("mouse");
      return false;
    }
  };

  const move = (e) => {
    const { cursor } = getComputedStyle(e.target); //Gets the current cursor style
    const touchEvent = e.touches ? e.touches[0] : null;
    const x = !isTouchDevice() ? e.clientX : touchEvent?.clientX || 0;
    const y = !isTouchDevice() ? e.clientY : touchEvent?.clientY || 0;

    //Do not show the pencil's tip when cursor is on top of other elements asside from the drawing canvas
    if (y > window.innerHeight - 120 || cursor === "pointer") {
      setCursor(false);
      return;
    } else {
      setCursor(true);
      // Set the cursor border's position directly
      const cursorBorder = document.getElementById("cursor");
      if (cursorBorder) {
        let width = cursorBorder.offsetWidth;
        cursorBorder.style.left = `${x - width / 2}px`;
        cursorBorder.style.top = `${y - width / 2}px`;
      }
    }
  };
  return (
    <div
      id="cursor"
      style={{
        background: pencilColors[pencilInfo.color],
        width: pencilInfo.color === "eraser" ? (pencilInfo.stroke + ERASER_STROKE) + "px" : pencilInfo.stroke,
        opacity: isCursor ? 1 : 0,
      }}></div>
  );
}

export default PenToMouse;
