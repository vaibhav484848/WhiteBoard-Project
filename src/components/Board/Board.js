import React, { useEffect,useLayoutEffect, useRef } from 'react';
import rough from 'roughjs'
import { useContext } from 'react';
import boardContext from '../../store/board-context'
import toolboxContext from '../../store/toolbox-context';
import { TOOL_ACTION_TYPES, TOOL_ITEMS } from '../../constants';
import classes from './index.module.css'

export default function Board(){
    const { elements,boardMouseDownHandler,boardMouseMoveHandler,boardMouseUpHandler,toolActionType,textAreaBlurHandler ,undo,redo} = useContext(boardContext);

    const{toolboxState}=useContext(toolboxContext);

    const canvaRef = useRef(null);
    const textAreaRef=useRef();

    useEffect(() => {
        const canvas=canvaRef.current;
        canvas.width=window.innerWidth;
        canvas.height=window.innerHeight;

    },[])
    useEffect(() => {
        function handleKeyDown(event) {
            if (event.ctrlKey && event.key === "z") {
                undo();
            } else if (event.ctrlKey && event.key === "y") {
                redo();
            }
        }

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [undo, redo]);
    
    useLayoutEffect(() => {
        const canvas=canvaRef.current;

        const context=canvas.getContext('2d');
        context.save();
        // canvas.width=window.innerWidth;
        // canvas.height=window.innerHeight;

        const roughCanvas = rough.canvas(canvas);
        console.log("this is elements",elements);

        elements.forEach((element)=>{
            switch(element.type){
                case(TOOL_ITEMS.LINE):
                case(TOOL_ITEMS.RECTANGLE):
                case(TOOL_ITEMS.CIRCLE):
                case(TOOL_ITEMS.ARROW):
                    roughCanvas.draw(element.roughEle)
                    break;
                case(TOOL_ITEMS.BRUSH):{
                    context.fillStyle = element.stroke;
                    context.fill(element.path);
                    context.restore();
                    break;
                } 
                case(TOOL_ITEMS.TEXT):{
                    context.textBaseline = "top";
                    context.font = `${element.size}px Caveat`;
                    context.fillStyle = element.stroke;
                    context.fillText(element.text, element.x1, element.y1);
                    context.restore();
                    break;
                }
                default:{
                    console.log("this is element",element);
                     throw new Error(`Unknown element type: ${element.type}`);
                }   

            }
            // roughCanvas.draw(element.roughEle)
        })



        // const generator=roughCanvas.generator;
        // const rectangle1= generator.rectangle(10, 10, 100, 100);
        // const rectangle2= generator.rectangle(150, 10, 100, 100, { fill: 'red'});

        // roughCanvas.draw(rectangle1);
        // roughCanvas.draw(rectangle2);

        return(
            () => {
                context.clearRect(0, 0, canvas.width, canvas.height);
            }
        )

    },[elements])

    useEffect(() => {
        const textarea = textAreaRef.current;
        if (toolActionType === TOOL_ACTION_TYPES.WRITING) {
            setTimeout(() => {
                textarea.focus();
            }, 0);
        }
    }, [toolActionType]);

    const handleMouseDown = (e) => {
        
        boardMouseDownHandler(e,toolboxState); 
    }

    const handleMouseMove = (e) => {
        if(toolActionType === 'DRAWING' || toolActionType==="ERASING")
        boardMouseMoveHandler(e,toolboxState);

    }
    const handleMouseUp = (e) => {
        // if(toolActionType === 'DRAWING' )
        boardMouseUpHandler(e,toolboxState);

    }
    
    return(
        <>
            {toolActionType===TOOL_ACTION_TYPES.WRITING && (
                <textarea
                    type='text'
                    ref={textAreaRef}
                    className={classes.textElementBox}
                    style={{
                        top:elements[elements.length-1].y1,
                        left: elements[elements.length - 1].x1,
                        fontSize: `${elements[elements.length - 1]?.size}px`,
                        color: elements[elements.length - 1]?.stroke,

                    }}
                    onBlur={(event)=>textAreaBlurHandler(event.target.value,toolboxState)}


                />

            )}
            <canvas 

                ref={canvaRef} 
                id="canvas"
                onMouseDown={handleMouseDown} 
                onMouseMove={handleMouseMove} 
                onMouseUp={handleMouseUp}

             
            />
        </>
    )
}