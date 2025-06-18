import React, { useReducer,useContext, useCallback } from 'react'
import { useState } from 'react'
import boardContext from './board-context'
import { TOOL_ITEMS,TOOL_ACTION_TYPES, BOARD_ACTIONS } from '../constants';
import rough from 'roughjs';
import { createElement } from '../Utils/element';
import toolboxContext from './toolbox-context';
import { getSvgPathFromStroke,arraysAreEqual } from '../Utils/element';
import getStroke from 'perfect-freehand';
import { isPointNearElement } from '../Utils/element';



const gen=rough.generator();

const initialState = {
    activeToolItem: TOOL_ITEMS.BRUSH,
    toolActionType: TOOL_ACTION_TYPES.NONE,
    elements: [],
    history: [[]],
    index: 0,
};
const boardReducer=(state,action)=>{
    
    switch(action.type){
        case BOARD_ACTIONS.CHANGE_TOOL:{
            console.log("Changing tool to:", action.payload.tool);
            return { 
                ...state,
                activeToolItem: action.payload.tool,
            };
        }
        case BOARD_ACTIONS.CHANGE_ACTION_TYPE:{
            
            return{
                ...state,
                toolActionType:action.payload.actionType,

            }
        }
        
        case BOARD_ACTIONS.DRAW_DOWN:{
            const{clientX, clientY,stroke,fill,size} = action.payload;
            const newElement=createElement(state.elements.length, clientX, clientY, clientX, clientY, {type: state.activeToolItem,stroke,fill,size});
            
            return{
                ...state,
                toolActionType:
                    state.activeToolItem===TOOL_ITEMS.TEXT
                    ?TOOL_ACTION_TYPES.WRITING
                    : TOOL_ACTION_TYPES.DRAWING,
                // toolActionType: TOOL_ACTION_TYPES.DRAWING,
                elements:[...state.elements,newElement]
            }
        }
            
        case BOARD_ACTIONS.DRAW_MOVE:{
            const{clientX, clientY,fill,stroke,size} = action.payload;
            const updatedElements = [...state.elements];
            const lastElement = updatedElements[updatedElements.length - 1];
            const type = lastElement.type;

            switch(type){
                case(TOOL_ITEMS.LINE):
                case(TOOL_ITEMS.RECTANGLE):
                case(TOOL_ITEMS.CIRCLE):
                case(TOOL_ITEMS.ARROW):
                    const {x1,y1}=lastElement;
                    const newElement=createElement(lastElement.id, x1, y1, clientX, clientY, {type: state.activeToolItem,fill,stroke,size});
                    updatedElements[updatedElements.length - 1] = newElement;
                    
                    
                    return{
                        ...state,
                        elements:[...updatedElements],
                    }
                case(TOOL_ITEMS.BRUSH):{
                    const newPoint={x:clientX,y:clientY};
                    lastElement.points.push(newPoint);
                    lastElement.path=new Path2D(getSvgPathFromStroke(getStroke(lastElement.points)));

                    return{
                        ...state,
                        elements:[...updatedElements],
                    }
                }
            }

            const {x1,y1}=lastElement;
            const newElement=createElement(lastElement.id, x1, y1, clientX, clientY, {type: state.activeToolItem,fill,stroke,size});
            updatedElements[updatedElements.length - 1] = newElement;
            
            
            return{
                ...state,
                elements:[...updatedElements],
            }
        }
        case BOARD_ACTIONS.DRAW_UP:{
            const elementsCopy=[...state.elements];
            const newHistory=state.history.slice(0,state.index+1)
            newHistory.push(elementsCopy);

            return {
                ...state,
               history:newHistory,
                index:state.index+1,
                
            };
        }

        case BOARD_ACTIONS.ERASE:{
            const{clientX,clientY}=action.payload;
            let newElements = [...state.elements];
            let newElements2=[]
            newElements2 = newElements.filter((element) => {
                return !isPointNearElement(element, clientX, clientY);
            });

            if(arraysAreEqual(newElements,newElements2)) {
                console.log("arrays are equal");
                return state;
            }

            const newHistory=state.history.slice(0,state.index+1)
            newHistory.push(newElements2);
            return{
                ...state,
                elements:newElements2,
                history:newHistory,
                index:state.index+1,
                
            }
        }
        case BOARD_ACTIONS.CHANGE_TEXT:{
            const{text}=action.payload;
            let idx=state.elements.length-1;
            let newElements=[...state.elements];
            newElements[idx].text=text;

            const newHistory=state.history.slice(0,state.index+1)
            newHistory.push(newElements);

            return{
                ...state,
                toolActionType:TOOL_ACTION_TYPES.NONE,
                elements:newElements,
                history:newHistory,
                index:state.index+1
            }

        }
        case BOARD_ACTIONS.UNDO:{
            if(state.index<1) return state ;
            return{
                ...state,
                elements:state.history[state.index-1],
                index:state.index-1,
            }
        }
        case BOARD_ACTIONS.REDO:{
            console.log(state.index);
            console.log(state.history.length-1);
            if(state.index>=state.history.length-1) return state ;
            return{
                ...state,
                elements:state.history[state.index+1],
                index:state.index+1,
            }
        }
        default:
            return state;
            
    }

}

const BoardProvider = ({children}) => {
    
    const[boardState,dispatchBoardAction]=useReducer(boardReducer,initialState);

    const changeToolHandler=(tool) =>{
        dispatchBoardAction({
            type: 'CHANGE_TOOL',
            payload: {
                tool,
            },
        });
    }

    const boardMouseDownHandler=(event,toolboxState) => {
        if (boardState.toolActionType === TOOL_ACTION_TYPES.WRITING) return;

        const{ clientX, clientY } = event;
        console.log(boardState.activeToolItem);

        if(boardState.activeToolItem===TOOL_ITEMS.ERASER){
            dispatchBoardAction({
                type:BOARD_ACTIONS.CHANGE_ACTION_TYPE,
                payload:{
                    actionType:TOOL_ACTION_TYPES.ERASING,

                }
            })
            return;
        }
        

        dispatchBoardAction({
            type:"DRAW_DOWN",
            payload:{
                clientX,
                clientY,
                stroke:toolboxState[boardState.activeToolItem]?.stroke,
                fill:toolboxState[boardState.activeToolItem]?.fill,
                size:toolboxState[boardState.activeToolItem]?.size,
            }
        })

    }

    const boardMouseMoveHandler=(event,toolboxState) => {
        if (boardState.toolActionType === TOOL_ACTION_TYPES.WRITING) return;

        const{ clientX, clientY } = event;
        console.log(clientX,clientY);

        console.log("bta kya h",boardState.toolActionType);


        if(boardState.toolActionType===TOOL_ACTION_TYPES.ERASING){
            dispatchBoardAction({
                type: BOARD_ACTIONS.ERASE,

                payload:{
                    clientX,
                    clientY,
                }
                
            })
        }
        
        else if(boardState.toolActionType===TOOL_ACTION_TYPES.DRAWING){
            dispatchBoardAction({
                type:"DRAW_MOVE",
                payload:{
                    clientX,
                    clientY,
                    stroke:toolboxState[boardState.activeToolItem]?.stroke,
                    fill:toolboxState[boardState.activeToolItem]?.fill,
                    size:toolboxState[boardState.activeToolItem]?.size,

                }
            })
        }

    }
    const boardMouseUpHandler=(event) => {
        if (boardState.toolActionType === TOOL_ACTION_TYPES.WRITING) return;
        if (boardState.toolActionType === TOOL_ACTION_TYPES.DRAWING) {
            dispatchBoardAction({
                type: BOARD_ACTIONS.DRAW_UP,
            });
        }
        dispatchBoardAction({
            type: BOARD_ACTIONS.CHANGE_ACTION_TYPE,
            payload:{
                actionType:TOOL_ACTION_TYPES.NONE,
            }
            
        })
    }

    const textAreaBlurHandler=(text,toolboxState)=>{
        dispatchBoardAction({
            type:BOARD_ACTIONS.CHANGE_TEXT,
            payload:{
                text,
                
            }
        })
    }

    const boardUndoHandler=useCallback(()=>{
        dispatchBoardAction({
            type:BOARD_ACTIONS.UNDO,
            
        })
    })
    const boardRedoHandler=useCallback(()=>{
         dispatchBoardAction({
            type:BOARD_ACTIONS.REDO,
            
        })

    })
    
    const boardContextValue={
        activeToolItem :boardState.activeToolItem,
        toolActionType: boardState.toolActionType,
        elements: boardState.elements,
        changeToolHandler,
        boardMouseDownHandler,
        boardMouseMoveHandler,
        boardMouseUpHandler,
        textAreaBlurHandler,
        undo:boardUndoHandler,
        redo:boardRedoHandler,

    }

  return (

   <boardContext.Provider value={boardContextValue}>
    {children}
    </boardContext.Provider>
  )
}

export default BoardProvider