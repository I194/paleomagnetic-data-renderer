import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import { Box, boxesIntersect } from 'react-drag-to-select';
import { MouseSelection, Dot } from "../../Sub";
import styles from './ZijdGraph.module.scss';

interface ITicksX {
  axisWidth: number;
  positionY: number;
}

const TicksX: FC<ITicksX> = ({ axisWidth, positionY }) => {
  const positionsX = []
  for (let position = 0; position <= axisWidth; position += axisWidth / 10) positionsX.push(position);
  return (
    <g id='zijd-ticks-x'>
      {
        positionsX.map((positionX, iter) => {
          return (
            <line
              id={`tick-x${iter}`}
              x1={positionX}
              y1={positionY - 5}
              x2={positionX}
              y2={positionY + 5}
              stroke="black"
              strokeWidth={2}
              key={iter}
            />
          )
        })
      }
    </g>
  )
}

interface ITicksY {
  axisWidth: number;
  positionX: number;
}

const TicksY: FC<ITicksY> = ({ axisWidth, positionX }) => {
  const positionsY = []
  for (let position = 0; position <= axisWidth; position += axisWidth / 10) positionsY.push(position);
  return (
    <g id='zijd-ticks-y'>
      {
        positionsY.map((positionY, iter) => {
          return (
            <line
              id={`tick-y${iter}`}
              x1={positionX - 5}
              y1={positionY}
              x2={positionX + 5}
              y2={positionY}
              stroke="black"
              strokeWidth={2}
              key={iter}
            />
          )
        })
      }
    </g>
  )
}

const ZijdGraph: FC = () => {

  const [showAnnotations, setShowAnnotations] = useState(false);
  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);
  const selectableItems = useRef<Box[]>([]);

  const XYdata = [[20, 20], [25, 70], [50, 40], [39, 72], [110, 119], [118, 129], [134, 141], [150, 150]];
  const width = 300;
  const height = 300;

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
        <g id="axes">
          <g id="zijd-x-axis">
            <line id="zijd-x" x1={0} y1={height/2} x2={width} y2={height/2} stroke="black" strokeWidth="2" />
            <TicksX axisWidth={width} positionY={height/2} />
          </g>
          <g id="zijd-y-axis">
            <line id="zijd-y" x1={width/2} y1={0} x2={width/2} y2={height} stroke="black" strokeWidth="2" />
            <TicksY axisWidth={height} positionX={width/2} />
          </g>
        </g>
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