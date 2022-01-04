import React, { FC } from "react";
import { Dot } from "..";
import { createStraightPath } from "../../../utils/createPath";

interface IData {
  graphId: string;
  type: string;
  data: Array<[number, number]>;
  selectedIndexes: Array<number>;
  handleDotClick: (index: number) => void;
  dotFillColor: string;
}

const Data: FC<IData> = ({
  graphId,
  type,
  data,
  selectedIndexes,
  handleDotClick,
  dotFillColor
 }) => {
  console.log(selectedIndexes);
  return (
    <g id={`${graphId}-${type}-data`}>
      <path 
        id={`${graphId}-${type}-path`}
        d={createStraightPath(data)}
        fill="none" 
        stroke="black" 
      />
      <g id={`${graphId}-${type}-dots`}>
        {data.map((xy, index) => {
          return (
            <Dot 
              x={xy[0]} 
              y={xy[1]} 
              id={`${graphId}-${type}-dot-${index}`} 
              key={index} 
              selected={selectedIndexes.includes(index)}
              fillColor={dotFillColor}
              strokeColor="black"
              onClick={handleDotClick}
            />
          )
        })}
      </g>
    </g>
  )
}

export default Data;
