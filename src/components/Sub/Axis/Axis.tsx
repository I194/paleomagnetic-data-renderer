import React, { FC } from "react"
import { Ticks } from ".."

interface IAxis {
  graphId: string;
  type: 'x' | 'y';
  name: string;
  zero: number;
  length: number;
  unit: number;
}

const Axis: FC<IAxis> = ({ 
  graphId, 
  type,
  name,
  zero, 
  length, 
  unit
}) => {

  const axisPos = {
    x: {
      x1: 0,
      y1: zero,
      x2: length,
      y2: zero,
      text: {
        x: length + 10,
        y: zero + 4,
      }
    },
    y: {
      x1: zero,
      y1: 0,
      x2: zero,
      y2: length,
      text: {
        x: zero - 20,
        y: -10,
      }
    }
  }

  return (
    <g id={`${graphId}-${type}-axis`}>
      <line 
        id={`${graphId}-${type}-line`} 
        x1={axisPos[type].x1} 
        y1={axisPos[type].y1} 
        x2={axisPos[type].x2} 
        y2={axisPos[type].y2} 
        stroke="black" 
        strokeWidth="1" 
      />
      <Ticks 
        axis={type} 
        start={0} 
        zero={zero} 
        interval={unit} 
        count={10}
      />
      <text 
        id={`${graphId}-${type}-name`} 
        x={axisPos[type].text.x} 
        y={axisPos[type].text.y}
      >
        {name}
      </text>
    </g>
  ) 
}

export default Axis;
