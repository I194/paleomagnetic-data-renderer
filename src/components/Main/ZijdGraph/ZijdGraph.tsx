import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import { Box, boxesIntersect } from 'react-drag-to-select';
import { MouseSelection, Dot } from "../../Sub";
import styles from './ZijdGraph.module.scss';

const ZijdGraph: FC = () => {

  const [showAnnotations, setShowAnnotations] = useState(false);
  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);
  const selectableItems = useRef<Box[]>([]);

  const XYdata = [[20, 20], [25, 70], [50, 40], [39, 72], [110, 119], [118, 129], [134, 141], [150, 150]];

  useEffect(() => {
    const elementsContainer = document.getElementById('zijd-graph-dots');
    if (elementsContainer) {
      Array.from(elementsContainer.childNodes).forEach((item) => {
        //@ts-ignore
        const { left, top, width, height } = item.getBoundingClientRect();
        selectableItems.current.push({
          left,
          top,
          width,
          height,
        });
      });
    }
  }, []);
  
  const handleSelectionChange = useCallback(
    (box: Box) => {
      const indexesToSelect: number[] = [];

      selectableItems.current.forEach((item, index) => {
        if (boxesIntersect(box, item)) {
          indexesToSelect.push(index % selectableItems.current.length);
        }
      });

      console.log(indexesToSelect)
      setSelectedIndexes(indexesToSelect);
    }, [selectableItems],
  );

  const handleDoubleClick = (event: { detail: any; }) => {
    const timesClicked = event.detail;
    if (timesClicked === 2) {
      setSelectedIndexes([]);
    }
  }

  return (
    <>
      <MouseSelection onSelectionChange={handleSelectionChange} />
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="300px" height="300px" id='zijd-graph' onClick={handleDoubleClick}>
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
        <g id='zijd-graph-dots'>
          {XYdata.map((xy, iter) => {
            return (
              <Dot 
                x={xy[0]} 
                y={xy[1]} 
                id={`dot${iter}`} 
                key={iter} 
                selected={selectedIndexes.includes(iter)}
                showText={showAnnotations}
              />
            )
          })}
        </g>
      </svg>
      <button id='showAnnotations' onClick={() => setShowAnnotations(!showAnnotations)} style={{marginTop: '24px'}}>Show annotations</button>
    </>
  )
}

export default ZijdGraph;