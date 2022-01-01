import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import { Box, boxesIntersect } from 'react-drag-to-select';
import { createStraightPath } from "../../../utils/createPath";
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
    <g id='ticks-x'>
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
              strokeWidth={1}
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
    <g id='ticks-y'>
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
              strokeWidth={1}
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

  const horizontalProjectionData: Array<[number, number]> = [
    [20, 20], [25, 70], [50, 40], [39, 72], [110, 119], [118, 129], [134, 141], [150, 150]
  ]; // 'x' is Y, 'y' is X
  const verticalProjectionData: Array<[number, number]> = [
    [20, 170], [25, 190], [50, 210], [39, 132], [110, 158], [118, 169], [134, 149], [150, 150]
  ]; // 'x' is Y, 'y' is Z
  const width = 300;
  const height = 300;
  const graphAreaMargin = 50;

  useEffect(() => {
    const elementsContainerH = document.getElementById('h-dots');
    const elementsContainerV = document.getElementById('v-dots');
    if (elementsContainerH && elementsContainerV) {
      const selectableNodes =  Array.from(elementsContainerH.childNodes).concat(Array.from(elementsContainerV.childNodes));
      selectableNodes.forEach((item) => {
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
          // тут берём остаток от деления на число точек поскольку иногда используемая
          // для выбора элементов библиотека сбоит и аккумулирует точки
          // например, было 16 точек в selectableItems.current, и после обновления страницы их стало 32, а потом 48 и т.д.
          // делим selectableItems.current.length на 2 из-за особенностей диаграммы Зийдервельда -- "белые" и "чёрные" точки
          // отражают одну и ту же физическую сущность, но просто в разных проекциях, потому и выбираться должны как одна точка
          indexesToSelect.push(index % (selectableItems.current.length / 2));
        }
      });

      setSelectedIndexes(indexesToSelect);
    }, [selectableItems],
  );

  const handleDoubleClick = (event: any) => {
    const timesClicked = event.detail;
    if (timesClicked === 2) {
      setSelectedIndexes([]);
    }
  }

  return (
    <>
      <MouseSelection onSelectionChange={handleSelectionChange} />
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="400px" height="400px" id='zijd-graph' onClick={handleDoubleClick}>
        <g id="axes" transform={`translate(${graphAreaMargin}, ${graphAreaMargin})`}>
          <g id="x-axis">
            <line id="x-line" x1={0} y1={height/2} x2={width} y2={height/2} stroke="black" strokeWidth="1" />
            <TicksX axisWidth={width} positionY={height/2} />
            <text id="x-name" x={width + 10} y={height/2 + 4}>N, N</text>
          </g>
          <g id="y-axis">
            <line id="y-line" x1={width/2} y1={0} x2={width/2} y2={height} stroke="black" strokeWidth="1" />
            <TicksY axisWidth={height} positionX={width/2} />
            <text id="y-name" x={width/2 - 20} y={0 - 10}>W, UP</text>
          </g>
        </g>
        {/* 
            Создавать маркеры черезе path нельзя, ибо тогда теряется почти весь их функционал
            Добавить слушатель можно только к конкретному элементу по типу <circle />
            Потому лучше отрисовывать отдельно каждый <circle /> через map массива координат
            Однако hover всё равно работать не будет и потому лучше использовать onMouseOver
            Как раз при этом достигается условие zero-css (я его только что сам придумал)
        */}
        <g id='horizontal-data' transform={`translate(${graphAreaMargin}, ${graphAreaMargin})`}>
          <path 
            id='h-path'
            d={createStraightPath(horizontalProjectionData)}
            fill="none" 
            stroke="black" 
          />
          <g id='h-dots'>
            {horizontalProjectionData.map((xy, iter) => {
              return (
                <Dot 
                  x={xy[0]} 
                  y={xy[1]} 
                  id={`h-dot${iter}`} 
                  key={iter} 
                  selected={selectedIndexes.includes(iter)}
                  showText={showAnnotations}
                  fillColor='black'
                  strokeColor='black'
                />
              )
            })}
          </g>
        </g>
        <g id='vertical-data' transform={`translate(${graphAreaMargin}, ${graphAreaMargin})`}>
          <path 
            id='v-path'
            d={createStraightPath(verticalProjectionData)}
            fill="none"
            stroke="black" 
          />
          <g id='v-dots'>
            {verticalProjectionData.map((xy, iter) => {
              return (
                <Dot 
                  x={xy[0]} 
                  y={xy[1]} 
                  id={`v-dot${iter}`} 
                  key={iter} 
                  selected={selectedIndexes.includes(iter)}
                  showText={showAnnotations}
                  fillColor='white'
                  strokeColor='black'
                />
              )
            })}
          </g>
        </g>
      </svg>
      <button id='showAnnotations' onClick={() => setShowAnnotations(!showAnnotations)} style={{marginTop: '24px'}}>Show annotations</button>
    </>
  )
}

export default ZijdGraph;