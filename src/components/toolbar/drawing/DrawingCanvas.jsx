import React, { useRef, useEffect } from "react";
import { ReactSketchCanvas } from "react-sketch-canvas";
import { pencilColors } from "../tools";
import { ERASER_STROKE } from "../../../lib/PenProperties";

const styles = {
  position: "absolute",
  left: 0,
  top: 0,
  height: "100%",
  width: "100%",
};

function DrawingArea({
  children,
  isActive = true,
  handleStroke = () => null,
  pencilInfo,
  storagePath = "drawPaths",
  forwardRef = () => null,
}) {
  /**
   * @param isActive : boolean -> When true allows user to draw on the screen
   * @param handleStroke : function() -> Event handler for when user starts/finishes a stroke
   * @param penData : Pen.Object -> Reference to PenProperties
   * @param storagePath : String -> The path in localStorage which drawing should be retrieved/saved
   * @param forwardRef : function(ref) -> Function that recieves the current ref to the canvas
   */

  const ref = useRef(null); //Ref hook for the drawing area
  const pathData = JSON.parse(localStorage.getItem(storagePath)) || null;

  useEffect(() => {
    //Loads previously saved pathData, if there is any
    if (pathData) {
      ref.current.clearCanvas();
      ref.current.loadPaths(pathData);
    }
    forwardRef(ref.current); //Sends ref to parent. For undo() function for example
  }, []);
  const onStroke = (e) => {
    // Event triggers at the start and end of stroke
    ref.current
      .exportPaths()
      .then((paths) =>
        localStorage.setItem(storagePath, JSON.stringify(paths))
      );
    handleStroke(e);
  };
  return (
    <>
      {children}
      <div
        style={{ ...styles, cursor: isActive ? "none" : "default" }}
        id="drawingCanvas">
        <ReactSketchCanvas
          ref={ref}
          strokeWidth={pencilInfo.stroke}
          strokeColor={pencilColors[pencilInfo.color]}
          canvasColor="transparent"
          onStroke={onStroke}
          eraserWidth={pencilInfo.stroke+ ERASER_STROKE }
          style={{ pointerEvents: isActive ? "all" : "none" }}
        />
      </div>
    </>
  );
}

export default DrawingArea;
