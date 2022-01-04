import React, { FC } from "react";
import styles from './Ticks.module.scss';

interface ITicks {
  axis: 'x' | 'y';
  start: number;
  zero: number;
  interval: number;
  count: number;
}

const Ticks: FC<ITicks> = ({ axis, start, zero, interval, count }) => {
  const positions = [];
  for (let i = 0; i <= count; i++) {
    positions.push(start + interval * i);
  }
  return (
    <g id={`ticks-${axis}`}>
      {
        positions.map((position, iter) => {
          return (
            <line
              id={`tick-x${iter}`}
              x1={axis === 'x' ? position : zero - 5}
              y1={axis === 'y' ? position : zero - 5}
              x2={axis === 'x' ? position : zero + 5}
              y2={axis === 'y' ? position : zero + 5}
              stroke="black"
              strokeWidth={1}
              key={iter}
            />
          )
        })
      }
    </g>
  )
}

export default Ticks;
