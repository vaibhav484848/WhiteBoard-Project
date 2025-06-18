import {  createContext, useContext, useState } from 'react';

const boardContext = createContext({
    activeToolItem: "",
    toolActionType: "",
    elements: [],
    history: [[]],
    index: 0,
    boardMouseDownHandler: () => {},
    changeToolHandler: () => {},
    boardMouseMoveHandler: () => {},
    boardMouseUpHandler: () => {},

});

export default boardContext