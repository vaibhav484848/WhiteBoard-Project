import { ELEMENT_ERASE_THRESHOLD } from "../constants";

export const isPointCloseToLine = (x1, y1, x2, y2, pointX, pointY) => {
  const distToStart = distanceBetweenPoints(x1, y1, pointX, pointY);
  const distToEnd = distanceBetweenPoints(x2, y2, pointX, pointY);
  const distLine = distanceBetweenPoints(x1, y1, x2, y2);
  return Math.abs(distToStart + distToEnd - distLine) < ELEMENT_ERASE_THRESHOLD;
};

export const isNearPoint = (x, y, x1, y1) => {
  return Math.abs(x - x1) < 5 && Math.abs(y - y1) < 5;
};



export const getArrowHeadsCoordinates=(x1, y1, x2, y2, arrowLength = 10) => {
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const arrowAngle = Math.PI / 6; // 30 degrees

    const x3 = x2 - arrowLength * Math.cos(angle - arrowAngle);
    const y3 = y2 - arrowLength * Math.sin(angle - arrowAngle);
    const x4 = x2 - arrowLength * Math.cos(angle + arrowAngle);
    const y4 = y2 - arrowLength * Math.sin(angle + arrowAngle);

    return {
        x3,
        y3,
        x4,
        y4
    };
}


const distanceBetweenPoints = (x1, y1, x2, y2) => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
};