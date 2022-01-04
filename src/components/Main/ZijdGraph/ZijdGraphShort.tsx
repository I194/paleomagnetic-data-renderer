import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import { Box, boxesIntersect } from "react-drag-to-select";
import { createStraightPath } from "../../../utils/createPath";
import { IGraph } from "../../App/App";
import { MouseSelection, Dot, GraphSymbols, Unit } from "../../Sub";
import styles from "./ZijdGraph.module.scss";

interface ITicksX {
  axisWidth: number;
  positionY: number;
}

const TicksX: FC<ITicksX> = ({ axisWidth, positionY }) => {
  const positionsX = []
  for (let position = 0; position <= axisWidth; position += axisWidth / 10) positionsX.push(position);
  return (
    <g id="ticks-x">
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
    <g id="ticks-y">
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

const ZijdGraphShort: FC<IGraph> = ({ graphId }) => {

  // ToDo: 
  // 1. scale (масштаб, можно прям как в final.pdf - Unit= xxxE+yy A/m)
  // 2. добавлять аннотацию при нажатии на точку
  // 3. менять viewBox в зависимости от размера группы data (horizontal-data + vertical-data)

  const [showAnnotations, setShowAnnotations] = useState(false);
  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);
  const [graphElement, setGraphElement] = useState(document.getElementById(`${graphId}-graph`));
  const selectableItems = useRef<Box[]>([]);

  const horizontalProjectionData: Array<[number, number]> = [
    [20, 20], [25, 70], [50, 40], [39, 72], [110, 119], [118, 129], [134, 141], [150, 150]
  ]; // "x" is Y, "y" is X
  const verticalProjectionData: Array<[number, number]> = [
    [20, 170], [25, 190], [50, 210], [39, 132], [110, 158], [118, 169], [134, 149], [150, 150]
  ]; // "x" is Y, "y" is Z
  const width = 300;
  const height = 300;
  const graphAreaMargin = 50;
  const viewWidth = width + graphAreaMargin * 2;
  const viewHeight = height + graphAreaMargin * 2;

  useEffect(() => {
    setGraphElement(document.getElementById(`${graphId}-graph`));
  }, [])

  useEffect(() => {
    const elementsContainerH = document.getElementById(`${graphId}-h-dots`);
    const elementsContainerV = document.getElementById(`${graphId}-v-dots`);
    console.log(elementsContainerH, elementsContainerV)
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

  const handleDotClick = (index: number) => {
    const selectedIndexesUpdated = Array.from(selectedIndexes);
    if (selectedIndexes.includes(index)) {
      selectedIndexesUpdated.splice(
        selectedIndexesUpdated.findIndex((selectedIndex) => selectedIndex === index),
        1
      );
    } else {
      console.log(index, selectedIndexes)
      selectedIndexesUpdated.push(index);
    }
    setSelectedIndexes(selectedIndexesUpdated);
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg" 
      version="1.1" 
      width={viewWidth} 
      height={viewHeight} 
      id={`${graphId}-graph`} 
      onClick={handleDoubleClick}
    >
      <MouseSelection onSelectionChange={handleSelectionChange} eventsElement={null}/>
      <g transform={`translate(${graphAreaMargin}, ${graphAreaMargin})`}>
        <text id={`${graphId}-x-name`} x={width + 10} y={height/2 + 4}>N, N</text>
        <text id={`${graphId}-y-name`} x={width/2 - 20} y={0 - 10}>W, UP</text>
      </g>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        version="1.1" 
        width={viewWidth} 
        height={viewHeight}
        // viewBox="0 0 150 150"
        id={`${graphId}-graph-inner`} 
        onClick={handleDoubleClick}
        
      >
        <g
          transform={
            `
              translate(${graphAreaMargin}, ${graphAreaMargin})
              scale(1.35)
            `
          }
        >
          <g id={`${graphId}-axes`} >
            <g id={`${graphId}-x-axis`}>
              <line id={`${graphId}-x-line`} x1={0} y1={height/2} x2={width} y2={height/2} stroke="black" strokeWidth="1" />
              <TicksX axisWidth={width} positionY={height/2} />
            </g>
            <g id={`${graphId}-y-axis`}>
              <line id={`${graphId}-y-line`} x1={width/2} y1={0} x2={width/2} y2={height} stroke="black" strokeWidth="1" />
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
          <g id={`${graphId}-data`}>
            <g id={`${graphId}-horizontal-data`}>
              <path 
                id={`${graphId}-h-path`}
                d={createStraightPath(horizontalProjectionData)}
                fill="none" 
                stroke="black" 
              />
              <g id={`${graphId}-h-dots`}>
                {horizontalProjectionData.map((xy, iter) => {
                  return (
                    <Dot 
                      x={xy[0]} 
                      y={xy[1]} 
                      id={`${graphId}-h-dot-${iter}`} 
                      key={iter} 
                      selected={selectedIndexes.includes(iter)}
                      showText={showAnnotations}
                      fillColor="black"
                      strokeColor="black"
                      onClick={handleDotClick}
                    />
                  )
                })}
              </g>
            </g>
            <g id={`${graphId}-vertical-data`}>
              <path 
                id={`${graphId}-v-path`}
                d={createStraightPath(verticalProjectionData)}
                fill="none"
                stroke="black" 
              />
              <g id={`${graphId}-v-dots`}>
                {verticalProjectionData.map((xy, iter) => {
                  return (
                    <Dot 
                      x={xy[0]} 
                      y={xy[1]} 
                      id={`${graphId}-v-dot-${iter}`} 
                      key={iter} 
                      selected={selectedIndexes.includes(iter)}
                      showText={showAnnotations}
                      fillColor="white"
                      strokeColor="black"
                      onClick={handleDotClick}
                    />
                  )
                })}
              </g>
            </g>
          </g>
        </g>
      </svg>
      <GraphSymbols 
        title1="Horizontal" id1="horizontal-data" 
        title2="Vertical" id2="vertical-data" 
        viewHeight={viewHeight} viewWidth={viewWidth}
      />
      <Unit 
        label={`${(height/10).toExponential(2)} A/m`} 
        viewHeight={viewHeight} viewWidth={viewWidth}
      />
    </svg>
  )
}

export default ZijdGraphShort;