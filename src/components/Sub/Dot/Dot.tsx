import React, { FC, useState } from "react";
import styles from './Dot.module.scss';
import { Tooltip } from "../index";
import { ITooltip } from "../Tooltip/Tooltip";

interface IDot {
  x: number;
  y: number;
  r?: number;
  id: string;
  selected?: boolean;
  showText?: boolean;
  fillColor: string;
  strokeColor: string;
}

const Dot: FC<IDot> = ({x, y, r, id, selected, showText, fillColor, strokeColor}) => {

  const [tooltipData, setTooltipData] = useState<ITooltip>();

  const handleClick = () => {
    console.log('a');
    alert('Нежнее!')
  }

  const handleOver = (id: string) => {
    const dot = document.getElementById(id);
    if (dot) {
      dot.style.setProperty('fill', 'orange');
      setTooltipData({
        isVisible: true,
        position: {
          left: dot.getBoundingClientRect().left,
          top: dot.getBoundingClientRect().top
        },
        dot: {
          id,
          x,
          y,
        }
      })
    }
  }

  const handleOut = (id: string) => {
    document.getElementById(id)?.style.setProperty('fill', fillColor);
    setTooltipData(undefined);
  }

  return (
    <g>
      {
        showText ?
        <text 
          id={`${id}__annotation`}
          x={x}
          y={y - 6}
        >
          {id}
        </text>
        : null
      }
      { selected ? 
        <circle
          cx={x} 
          cy={y} 
          r={r ? r + 2 : 6}
          id={`${id}__selection`}
          style={{
            fill: 'purple', 
            stroke: 'purple',
            opacity: '50%',
          }} 
        />
        : null
      }
      <circle 
        cx={x} 
        cy={y} 
        r={r ? r : 4}
        id={id}
        style={{
          fill: fillColor ? fillColor : 'black', 
          stroke: strokeColor ? strokeColor : 'black',
          cursor: 'pointer'
        }} 
        className={styles.dot}
        onClick={handleClick}
        onMouseOver={() => handleOver(id)}
        onMouseOut={() => handleOut(id)}
      />
      {
        tooltipData ? 
          <Tooltip
            position={tooltipData.position} 
            isVisible={tooltipData.isVisible} 
            dot={tooltipData.dot}
          /> 
        : null
      }
    </g>
  )
}

export default Dot;