import React, { FC } from "react";
import { Axis, Data } from "../../Sub";

interface IAxesAndData {
  graphId: string;
  graphAreaMargin: number;
  zeroX: number;
  zeroY: number;
  width: number;
  height: number;
  unit: number;
  unitCount: number;
  upData: Array<[number, number]>;
  downData: Array<[number, number]>;
  selectedIndexes: Array<number>;
  handleDotClick: (index: number) => void;
}

const AxesAndData: FC<IAxesAndData> = ({ 
  graphId, graphAreaMargin,
  zeroX, zeroY, width, height, unit, unitCount,
  upData, downData,
  selectedIndexes,
  handleDotClick
}) => {
  return (
    <g 
      id={`${graphId}-axes-and-data`}
      transform={`translate(${graphAreaMargin}, ${graphAreaMargin})`}
    >
      <g id={`${graphId}-axes`}>
        <circle 
          id='stereo-circle-axis'
          cx={zeroX} 
          cy={zeroY} 
          r={width/2}
          fill="none"
          stroke="black"
          strokeWidth={1}
        />
        <Axis 
          graphId={graphId}
          type='x'
          name='E'
          mirrorName='W'
          mirrorNamePosition={{x: -24, y: zeroY + 5}} 
          zero={zeroY}
          length={width}
          unit={unit}
          unitCount={unitCount}
          hideLine={true}
        />
        <Axis 
          graphId={graphId}
          type='y'
          name='N'
          mirrorName='S'
          mirrorNamePosition={{x: zeroX - 4.5, y: height + 20}} 
          zero={zeroX}
          length={height}
          unit={unit}
          unitCount={unitCount}
          hideLine={true}
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
        <Data 
          graphId={graphId}
          type='u'
          data={upData}
          selectedIndexes={selectedIndexes}
          handleDotClick={handleDotClick}
          dotFillColor='black'
        />
        <Data 
          graphId={graphId}
          type='d'
          data={downData}
          selectedIndexes={selectedIndexes}
          handleDotClick={handleDotClick}
          dotFillColor='white'
        />
      </g>
    </g>
  )
}

export default AxesAndData
