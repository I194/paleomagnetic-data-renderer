import React, { FC } from "react";
import styles from './ZijdGraph.module.scss';

interface ICircle {
  x: number;
  y: number;
  r?: number;
  id: string;
}

const Circle: FC<ICircle> = ({x, y, r, id}) => {

  const handleClick = () => {
    console.log('a');
    alert('Нежнее!')
  }

  const handleOver = (id: string) => {
    document.getElementById(id)?.style.setProperty('fill', 'orange');
  }

  const handleOut = (id: string) => {
    document.getElementById(id)?.style.setProperty('fill', 'black');
  }

  return (
    <circle 
      cx={x} 
      cy={y} 
      r={r ? r : 4}
      id={id}
      style={{
        fill: 'black', 
        stroke: 'black',
        cursor: 'pointer'
      }} 
      className={styles.dot}
      onClick={handleClick}
      onMouseOver={() => handleOver(id)}
      onMouseOut={() => handleOut(id)}
    />
  )
}

const ZijdGraph: FC = () => {

  const XYdata = [[20, 20], [25, 70], [50, 40], [39, 72], [110, 119], [118, 129], [134, 141], [150, 150]]

  return (
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="300px" height="300px" id='mySVG'>
      <line x1="150" y1="0" x2="150" y2="300" stroke="black" strokeWidth="2" />
      <line x1="0" y1="150" x2="300" y2="150" stroke="black" strokeWidth="2" />
      {/* 
          Создавать маркеры черезе path нельзя, ибо тогда теряется почти весь их функционал
          Добавить слушатель можно только к конкретному элементу по типу <circle />
          Потому лучше отрисовывать отдельно каждый <circle /> через map массива координат
          Однако hover всё равно работать не будет и потому лучше использовать onMouseOver
          Как раз при этом достигается условие zero-css (я его только что сам придумал)
      */}
      <path 
        d="M20,20 L25,70 L50,40 L39,72, L110,119, L118,129, L134,141, L150,150" 
        fill="none" 
        stroke=" black" 
      />
      {XYdata.map((xy, iter) => <Circle x={xy[0]} y={xy[1]} id={`dot${iter}`}/>)}
    </svg>
  )
}

export default ZijdGraph;