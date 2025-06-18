import React from 'react'
import classes from './index.module.css'
import { useState } from 'react'
import cx from 'classnames'

import {
  FaSlash,
  FaRegCircle,
  FaArrowRight,
  FaPaintBrush,
  FaEraser,
  FaUndoAlt,
  FaRedoAlt,
  FaFont,
  FaDownload,
} from "react-icons/fa";
import { LuRectangleHorizontal } from "react-icons/lu";
import {TOOL_ITEMS} from '../../constants'
import { useContext } from 'react';
import boardContext from '../../store/board-context'


const Toolbar = () => {
  const{ activeToolItem,changeToolHandler,undo,redo } = useContext(boardContext);

  const handleDownloadClick = () => {
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");

    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = canvas.width;
    exportCanvas.height = canvas.height;
    const exportContext = exportCanvas.getContext("2d");



    exportContext.fillStyle = "#ffffff";
    exportContext.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
    exportContext.drawImage(canvas, 0, 0);
    const data = canvas.toDataURL("image/png");
    const anchor = document.createElement("a");
    anchor.href = data;
    anchor.download = "board.png";
    anchor.click();
  };


  function downloadCanvasAsPNG() {

      const canvas = document.getElementById("canvas");
      const context = canvas.getContext('2d');
      // Save current canvas content
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

      // Draw white background
      context.globalCompositeOperation = 'destination-over';
      context.fillStyle = '#fff';
      context.fillRect(0, 0, canvas.width, canvas.height);

      // Download as PNG
      const link = document.createElement('a');
      link.download = 'whiteboard.png';
      link.href = canvas.toDataURL('image/png');
      link.click();

      // Restore canvas

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.putImageData(imageData, 0, 0);
      context.globalCompositeOperation = 'source-over';
  }

  return (
    
    <div className={classes.container}>
      {/* {console.log(activeToolItem)} */}
      <div className={cx(classes.toolItem,{[classes.active]:activeToolItem===TOOL_ITEMS.BRUSH})}
       onClick={() => changeToolHandler(TOOL_ITEMS.BRUSH)}>
         <FaPaintBrush/>
      </div>


      <div className={cx(classes.toolItem,{[classes.active]:activeToolItem===TOOL_ITEMS.LINE})}
       onClick={() => changeToolHandler(TOOL_ITEMS.LINE)}>
         <FaSlash/>
      </div>

      <div className={cx(classes.toolItem,{[classes.active]:activeToolItem===TOOL_ITEMS.RECTANGLE})}
       onClick={() => changeToolHandler(TOOL_ITEMS.RECTANGLE)}>
          <LuRectangleHorizontal/>
      </div>
      <div className={cx(classes.toolItem,{[classes.active]:activeToolItem===TOOL_ITEMS.CIRCLE})}
       onClick={() => changeToolHandler(TOOL_ITEMS.CIRCLE)}>
          <FaRegCircle/>
      </div>
      <div className={cx(classes.toolItem,{[classes.active]:activeToolItem===TOOL_ITEMS.ARROW})}
       onClick={() => changeToolHandler(TOOL_ITEMS.ARROW)}>
          <FaArrowRight/>
      </div>


      <div className={cx(classes.toolItem,{[classes.active]:activeToolItem===TOOL_ITEMS.ERASER})}
       onClick={() => changeToolHandler(TOOL_ITEMS.ERASER)}>
         <FaEraser/>
      </div>

      <div className={cx(classes.toolItem,{[classes.active]:activeToolItem===TOOL_ITEMS.TEXT})}
       onClick={() => changeToolHandler(TOOL_ITEMS.TEXT)}>
         <FaFont/>
      </div>


      <div className={classes.toolItem}
       onClick={() => undo()}>
         <FaUndoAlt/>
      </div>


      <div className={classes.toolItem}
       onClick={() => redo()}>
         <FaRedoAlt/>
      </div>

      <div className={classes.toolItem}
       onClick={() => downloadCanvasAsPNG()}>
         <FaDownload/>
      </div>

      



    </div>
  )
}

export default Toolbar