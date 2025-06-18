import React, { useReducer } from 'react'
import toolboxContext from './toolbox-context'
import { COLORS,TOOL_ITEMS, TOOLBOX_ACTIONS } from '../constants';


function toolboxReducer(state, action) {
    switch(action.type) {
        case 'CHANGE_STROKE': {
            const { tool, stroke } = action.payload;
            const newState={...state};
            newState[tool].stroke=  stroke;
            return newState;


            // return {
            //     ...state,
            //     [tool]: {
            //         ...state[tool],
            //         stroke: stroke
            //     }
            // };
        }
        case 'CHANGE_FILL': {
            const {tool,fill}=action.payload;
            const newState={...state};
            newState[tool].fill=fill;
            return newState;
        }
        case 'CHANGE_SIZE': {
            const {tool, size} = action.payload;
            const newState={...state};
            newState[tool].size=size;
            return newState;
        }

        default:{
            return state;
        }
    }

}

const initialToolboxState = {
    [TOOL_ITEMS.LINE]:{
        stroke: COLORS.BLACK,
        // fill: COLORS.WHITE,
        size: 1,
    },
    [TOOL_ITEMS.RECTANGLE]:{
        stroke: COLORS.BLACK,
        fill: null,
        size: 1,
    },
    [TOOL_ITEMS.CIRCLE]:{
        stroke: COLORS.BLACK,
        fill: null,
        size: 1,
    },
    [TOOL_ITEMS.ARROW]:{
        stroke: COLORS.BLACK,
        // fill: COLORS.WHITE,
        size: 1,
    },
    [TOOL_ITEMS.BRUSH]:{
        stroke: COLORS.BLACK,
        // fill: COLORS.WHITE,
        size: 1,
    },
    [TOOL_ITEMS.ERASER]:{
        stroke: COLORS.BLACK,
        // fill: COLORS.WHITE,
        size: 1,
    },
    [TOOL_ITEMS.TEXT]:{
        stroke: COLORS.BLACK,
        // fill: COLORS.WHITE,
        size: 32,
    },
    
};



const ToolboxProvider = ({children}) => {
    const [toolboxState,dispatchToolboxAction]=useReducer(toolboxReducer,initialToolboxState);

    const changeStrokeHandler = (tool, stroke) => {
        dispatchToolboxAction({
            type: TOOLBOX_ACTIONS.CHANGE_STROKE,
            payload: { tool, stroke }
        });
    };

    const changeFillHandler=(tool,fill)=>{
        dispatchToolboxAction({
            type: TOOLBOX_ACTIONS.CHANGE_FILL,
            payload: { tool, fill }
        })
    }

    const changeSizeHandler=(tool,size)=>{
        dispatchToolboxAction({
            type: TOOLBOX_ACTIONS.CHANGE_SIZE,
            payload: { tool, size }
        })
    }

    const toolboxContextValue = {
        toolboxState,
        changeStroke:changeStrokeHandler,
        changeFill:changeFillHandler,
        changeSize:changeSizeHandler,

    }


  return (
    <toolboxContext.Provider value={toolboxContextValue}>
        {children}
    </toolboxContext.Provider>
  )
}

export default ToolboxProvider