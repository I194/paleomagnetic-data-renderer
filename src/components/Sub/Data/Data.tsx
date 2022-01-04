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
  return (
    <g id={`${graphId}-${type}-data`}>
      <path 
        id={`${graphId}-${type}-path`}
        d={createStraightPath(data)}
        fill="none" 
        stroke="black" 
      />
      <g id={`${graphId}-${type}-dots`}>
        {data.map((xy, iter) => {
          return (
            <Dot 
              x={xy[0]} 
              y={xy[1]} 
              id={`${graphId}-${type}-dot-${iter}`} 
              key={iter} 
              selected={selectedIndexes.includes(iter)}
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
