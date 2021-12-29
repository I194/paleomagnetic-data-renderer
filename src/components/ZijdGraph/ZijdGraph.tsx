import React, { FC } from "react";
import styles from './ZijdGraph.module.scss';

const Circle: FC = () => {

  const handleClick = () => {
    console.log('a');
  }

  const handleOver = () => {
    document.getElementById('dot1')?.style.setProperty('fill', 'red');
  }

  const handleOut = () => {
    document.getElementById('dot1')?.style.setProperty('fill', 'black');
  }

  return (
    <circle 
      cx="25" 
      cy="25" 
      r="10"
      id="dot1"
      style={{
        fill: 'black', 
        stroke: 'black'
      }} 
      className={styles.dot}
      onClick={handleClick}
      onMouseOver={handleOver}
      onMouseOut={handleOut}
    />
  )
}

const ZijdGraph: FC = () => {



  return (
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="300px" height="300px" id='mySVG'>
      <line x1="150" y1="0" x2="150" y2="300" stroke="black" strokeWidth="2" />
      <line x1="0" y1="150" x2="300" y2="150" stroke="black" strokeWidth="2" />
      
      <defs>
        <marker id="mC" markerWidth="10" markerHeight="10" refX="5" refY="5">
          <circle 
            cx="5" 
            cy="5" 
            r="2" 
            style={{
              fill: 'black', 
              stroke: 'black'
            }} 
          />
        </marker>
      </defs>
      {/* 
          Создавать маркеры черезе path нельзя, ибо тогда теряется почти весь их функционал
          Добавить слушатель можно только к конкретному элементу по типу <circle />
          Потому лучше отрисовывать отдельно каждый <circle /> через map массива координат
          Однако hover всё равно работать не будет и потому лучше использовать onMouseOver
          Как раз при этом достигается условие zero-css (я его только что сам придумал)
      */}
      <Circle />
      <path 
        d="M20,20 L25,70 L50,40 L39,72, L110,119, L118,129, L134,141, L150,150" 
        markerStart="url(#mC)" 
        markerMid="url(#mC)" 
        markerEnd="url(#mC)" 
        fill="none" 
        stroke=" black" 
      />
    </svg>
  )
}

export default ZijdGraph;