import { ARROW_LENGTH, TOOL_ITEMS } from "../constants"
import rough from "roughjs";
import { getArrowHeadsCoordinates, isPointCloseToLine } from "./math";
import getStroke from "perfect-freehand";
// import toolboxContext from "../store/toolbox-context";

const gen= rough.generator();
export const createElement=(id,x1,y1,x2,y2,{type,stroke,fill,size})=>{
   

    const element={
        id,
        x1,
        y1,
        x2,
        y2,
        type,
        stroke,
        size,
        
    }

    let options={
        seed:id+1,
        stroke:stroke,
        fill: fill,
        fillStyle: 'solid',
        // size:size,
        strokeWidth: size,
        // stroke:toolboxState[type].stroke,

    }
    console.log("this is type",type);

    switch(type){
       
        case TOOL_ITEMS.BRUSH:{
            const brushElement={
                id,
                points: [{ x: x1, y: y1 }],
                path: new Path2D(getSvgPathFromStroke(getStroke([{ x: x1, y: y1 }]))),
                type,
                stroke,
            };
            return brushElement;


        }
        case TOOL_ITEMS.LINE:{
            console.log("this is line hai");
            element.roughEle= gen.line(x1,y1,x2,y2,options);
            return element;
        }
        case TOOL_ITEMS.RECTANGLE:{
            element.roughEle=gen.rectangle(x1,y1,x2-x1,y2-y1,options);
            return element;
        }
        case TOOL_ITEMS.CIRCLE:{
            // element.roughEle=gen.circle(x1,y1,Math.abs(x2-x1),options);
            const cx= (x1+x2)/2;
            const cy= (y1+y2)/2;
            const width=Math.abs(x2-x1)
            const height=Math.abs(y2-y1)
            element.roughEle=gen.ellipse(cx,cy,width,height,options);

            return element;
        }
        case TOOL_ITEMS.ARROW:{
          const {x3,y3,x4,y4} = getArrowHeadsCoordinates(x1, y1, x2, y2 ,ARROW_LENGTH);

          const points=[
            [x1, y1],
            [x2, y2],
            [x3, y3],
            [x2, y2],
            [x4, y4]
          ]
          element.roughEle=gen.linearPath(points, options);

            return element;


            
        }
        case TOOL_ITEMS.TEXT:{
            element.text=""
            return element;
        }
        default:{
            throw new Error("Unsupported tool type");
        }
    }
}

export const isPointNearElement=(element,clientX,clientY)=>{
    const{x1,y1,x2,y2,type}=element;

    switch(type) {
        case TOOL_ITEMS.LINE:
        case TOOL_ITEMS.ARROW:
            return isPointCloseToLine(x1,y1,x2,y2,clientX, clientY);
        case TOOL_ITEMS.RECTANGLE:
        case TOOL_ITEMS.CIRCLE:    
            return(
                isPointCloseToLine(x1,y1,x1,y2,clientX,clientY)||
                isPointCloseToLine(x2,y1,x2,y2,clientX,clientY)||
                isPointCloseToLine(x1,y1,x2,y1,clientX,clientY)||
                isPointCloseToLine(x1,y2,x2,y2,clientX,clientY)
                
            );
        case TOOL_ITEMS.BRUSH:
            const Context=document.getElementById("canvas").getContext("2d");
            return Context.isPointInPath(element.path,clientX,clientY);
        case TOOL_ITEMS.TEXT:
            const context=document.getElementById("canvas").getContext("2d");
                    context.font = `${element.size}px Caveat`;
                    context.fillStyle = element.stroke;
                    const textWidth = context.measureText(element.text).width;
                    const textHeight = parseInt(element.size);
                    context.restore();
                    return (
                        isPointCloseToLine(x1, y1, x1 + textWidth, y1, clientX, clientY) ||
                        isPointCloseToLine(
                        x1 + textWidth,
                        y1,
                        x1 + textWidth,
                        y1 + textHeight,
                        clientX,
                        clientY
                        ) ||
                        isPointCloseToLine(
                        x1 + textWidth,
                        y1 + textHeight,
                        x1,
                        y1 + textHeight,
                        clientX,
                        clientY
                        ) ||
                        isPointCloseToLine(x1, y1 + textHeight, x1, y1, clientX, clientY)
                    );
                        
        // case TOOL_ITEMS. 
        default :
            throw new Error("Type Not Recognized") ;
            

    }
    // return false;
}
export const getSvgPathFromStroke = (stroke) => {
    if (!stroke.length) return "";
  
    const d = stroke.reduce(
      (acc, [x0, y0], i, arr) => {
        const [x1, y1] = arr[(i + 1) % arr.length];
        acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
        return acc;
      },
      ["M", ...stroke[0], "Q"]
    );
  
    d.push("Z");
    return d.join(" ");
  };

    
    export function arraysAreEqual(arr1, arr2) {
        console.log(arr1,arr2);
    return JSON.stringify(arr1) === JSON.stringify(arr2);
}
  