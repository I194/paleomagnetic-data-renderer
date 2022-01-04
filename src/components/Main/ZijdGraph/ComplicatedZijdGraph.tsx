import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import { Box, boxesIntersect } from 'react-drag-to-select';
import { createStraightPath } from "../../../utils/createPath";
import { IGraph } from "../../App/App";
import { MouseSelection, Dot, GraphSymbols, Unit, Ticks } from "../../Sub";
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

const ComplicatedZijdGraph: FC<IGraph> = ({ graphId }) => {

  // ToDo: 
  // 1. scale (масштаб, можно прям как в final.pdf - Unit= xxxE+yy A/m)
  // 2. добавлять аннотацию при нажатии на точку
  // 3. менять viewBox в зависимости от размера группы data (horizontal-data + vertical-data)

  const [showAnnotations, setShowAnnotations] = useState(false);
  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);
  const selectableItems = useRef<Box[]>([]);

  const horizontalProjectionData: Array<[number, number]> = [
    [20, 20], [25, 70], [50, 40], [39, 72], [110, 119], [118, 129], [134, 141], [150, 150]
  ]; // 'x' is Y, 'y' is X
  const verticalProjectionData: Array<[number, number]> = [
    [20, 170], [25, 190], [50, 210], [39, 132], [110, 158], [118, 169], [134, 149], [150, 150]
  ]; // 'x' is Y, 'y' is Z
  const valuesX = horizontalProjectionData.concat(verticalProjectionData).map((xy) => xy[0]);
  const valuesY = horizontalProjectionData.concat(verticalProjectionData).map((xy) => xy[1]);

  const width = 300;
  const height = 300;

  const graphAreaMargin = 50;
  const viewWidth = 300 + graphAreaMargin * 2;
  const viewHeight = 300 + graphAreaMargin * 2;

  const unit = (width / 10);// * (viewWidth / width);
  const zeroX = (width / 2);
  const zeroY = (height / 2);

  const minX = Math.min(...valuesX);
  const minY = Math.min(...valuesY);
  const maxX = Math.max(...valuesX);
  const maxY = Math.max(...valuesY);

  const leftAxesBorder = Math.floor(minX/unit) * unit;
  const rightAxesBorder = Math.ceil(maxX/unit) * unit;
  const topAxesBorder = Math.floor(minY/unit) * unit;
  const bottomAxesBorder = Math.ceil(maxY/unit) * unit;


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

  return (
    <>
      <MouseSelection onSelectionChange={handleSelectionChange} />
      <svg
        width={viewWidth} 
        height={viewHeight} 
        id='czijd-graph' 
        onClick={handleDoubleClick}
      >
        {/* <g
          transform="translate(50, 50)"
        >
          <text id="x-name" x={rightAxesBorder + 10} y={zeroY + 4}>N, N</text>
          <text id="y-name" x={width/2 - 20} y={topAxesBorder - 10}>W, UP</text>
        </g> */}
        <g
          transform={
            `
              scale(1.25)
            `
          }
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            version="1.1" 
            width={viewWidth} 
            height={viewHeight} 
            // viewBox={`${leftAxesBorder} ${topAxesBorder} ${rightAxesBorder + 50} ${bottomAxesBorder + 50}`}
            // width={viewWidth} 
            // height={viewHeight} 
            // width={150}
            // height={300}
          >
            <g 
              id="axes" 
              transform={`translate(${graphAreaMargin}, ${graphAreaMargin})`}
            >
              <g id="x-axis">
                {/* <line id="x-line" x1={0} y1={height/2} x2={width} y2={height/2} stroke="black" strokeWidth="1" />
                <TicksX axisWidth={width} positionY={height/2} />
                <text id="x-name" x={width + 10} y={height/2 + 4}>N, N</text> */}
                <line id="x-line" x1={leftAxesBorder} y1={zeroY} x2={rightAxesBorder} y2={zeroY} stroke="black" strokeWidth="1" />
                <Ticks 
                  axis="x" 
                  start={Math.floor(minX/unit) * unit} 
                  zero={zeroX} 
                  interval={unit} 
                  count={Math.ceil((maxX - minX) / unit)}
                />
                <text id="x-name" x={rightAxesBorder + 10} y={zeroY + 4}>N, N</text>
              </g>
              <g id="y-axis">
                {/* <line id="y-line" x1={width/2} y1={0} x2={width/2} y2={height} stroke="black" strokeWidth="1" />
                <TicksY axisWidth={height} positionX={width/2} />
                <text id="y-name" x={width/2 - 20} y={0 - 10}>W, UP</text> */}
                <line id="y-line" x1={zeroX} y1={topAxesBorder} x2={zeroX} y2={bottomAxesBorder} stroke="black" strokeWidth="1" />
                <Ticks 
                  axis="y" 
                  start={topAxesBorder} 
                  zero={zeroY} 
                  interval={unit} 
                  count={Math.ceil((maxY - minY) / unit)}
                />
                <text id="y-name" x={width/2 - 20} y={topAxesBorder - 10}>W, UP</text>
              </g>
            </g>
            {/* 
                Создавать маркеры черезе path нельзя, ибо тогда теряется почти весь их функционал
                Добавить слушатель можно только к конкретному элементу по типу <circle />
                Потому лучше отрисовывать отдельно каждый <circle /> через map массива координат
                Однако hover всё равно работать не будет и потому лучше использовать onMouseOver
                Как раз при этом достигается условие zero-css (я его только что сам придумал)
            */}
            <g 
              id='horizontal-data' 
              transform={`translate(${graphAreaMargin}, ${graphAreaMargin})`}
            >
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
                      id={`h-dot-${iter}`} 
                      key={iter} 
                      selected={selectedIndexes.includes(iter)}
                      showText={showAnnotations}
                      fillColor='black'
                      strokeColor='black'
                      onClick={handleDotClick}
                    />
                  )
                })}
              </g>
            </g>
            <g 
              id='vertical-data' 
              transform={`translate(${graphAreaMargin}, ${graphAreaMargin})`}
            >
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
                      id={`v-dot-${iter}`} 
                      key={iter} 
                      selected={selectedIndexes.includes(iter)}
                      showText={showAnnotations}
                      fillColor='white'
                      strokeColor='black'
                      onClick={handleDotClick}
                    />
                  )
                })}
              </g>
            </g>
          </svg>
          <g
            transform={
              `
                translate(0, -80)
              `
            }
          >
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
        </g>


      </svg>
    </>
  )
}

export default ComplicatedZijdGraph;