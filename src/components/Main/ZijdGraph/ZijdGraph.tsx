import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import { Box, boxesIntersect } from "react-drag-to-select";
import { createStraightPath } from "../../../utils/createPath";
import { IGraph } from "../../App/App";
import { MouseSelection, Dot, GraphSymbols, Unit, Axis } from "../../Sub";
import styles from "./ZijdGraph.module.scss";


interface IAxesAndData {
  graphId: string;
  graphAreaMargin: number;
  zeroX: number;
  zeroY: number;
  width: number;
  height: number;
  unit: number;
  horizontalProjectionData: Array<[number, number]>;
  verticalProjectionData: Array<[number, number]>;
  selectedIndexes: Array<number>;
  handleDotClick: (index: number) => void;
}

const AxesAndData: FC<IAxesAndData> = ({ 
  graphId, graphAreaMargin,
  zeroX, zeroY, width, height, unit,
  horizontalProjectionData, verticalProjectionData,
  selectedIndexes,
  handleDotClick
}) => {
  return (
    <g 
      id={`${graphId}-axes-and-data`}
      transform={`translate(${graphAreaMargin}, ${graphAreaMargin})`}
    >
      <g id={`${graphId}-axes`}>
        <Axis 
          graphId={graphId}
          type='x'
          name='N, N'
          zero={zeroY}
          length={width}
          unit={unit}
        />
        <Axis 
          graphId={graphId}
          type='y'
          name='W, UP'
          zero={zeroX}
          length={height}
          unit={unit}
        />
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
  )
}

const ZijdGraph: FC<IGraph> = ({ graphId }) => {

  // ToDo: 
  // 1. менять viewBox в зависимости от размера группы data (horizontal-data + vertical-data) || STOPPED
  // 2. zoom&pan

  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);

  const selectableItems = useRef<Box[]>([]);
  const zijdGraph = useRef<any>();

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

  const unit = (width / 10);// * (viewWidth / width);
  const zeroX = (width / 2);
  const zeroY = (height / 2);

  useEffect(() => {
    selectableItems.current = [];
    const elementsContainerH = document.getElementById(`${graphId}-h-dots`);
    const elementsContainerV = document.getElementById(`${graphId}-v-dots`);
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

  const handleDotClick = (index: number) => {
    const selectedIndexesUpdated = Array.from(selectedIndexes);
    if (selectedIndexes.includes(index)) {
      selectedIndexesUpdated.splice(
        selectedIndexesUpdated.findIndex((selectedIndex) => selectedIndex === index),
        1
      );
    } else {
      selectedIndexesUpdated.push(index);
    }
    setSelectedIndexes(selectedIndexesUpdated);
  }

  const handleDoubleClick = (event: any) => {
    const timesClicked = event.detail;
    if (timesClicked === 2) {
      setSelectedIndexes([]);
    }
  }

  return (
    <>
      <MouseSelection onSelectionChange={handleSelectionChange} eventsElement={null}/>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        version="1.1" 
        width={viewWidth} 
        height={viewHeight} 
        id={`${graphId}-graph`} 
        onClick={handleDoubleClick}
        ref={zijdGraph}
      > 
        <g>
          <AxesAndData 
            graphId={graphId}
            graphAreaMargin={graphAreaMargin}
            zeroX={zeroX}
            zeroY={zeroY}
            width={width}
            height={height}
            unit={unit}
            horizontalProjectionData={horizontalProjectionData}
            verticalProjectionData={verticalProjectionData}
            selectedIndexes={selectedIndexes}
            handleDotClick={handleDotClick}
          />
          <GraphSymbols 
            title1="Horizontal" id1="horizontal-data" 
            title2="Vertical" id2="vertical-data" 
            viewHeight={viewHeight} viewWidth={viewWidth}
          />
          <Unit 
            label={`${(height/10).toExponential(2)} A/m`} 
            viewHeight={viewHeight} viewWidth={viewWidth}
          />
        </g>
      </svg>
    </>
  )
}

export default ZijdGraph;