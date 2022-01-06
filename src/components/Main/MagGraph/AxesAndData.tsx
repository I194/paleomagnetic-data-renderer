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
  data: Array<[number, number]>;
  maxMAG: number;
  selectedIndexes: Array<number>;
  handleDotClick: (index: number) => void;
}

const AxesAndData: FC<IAxesAndData> = ({ 
  graphId, graphAreaMargin,
  zeroX, zeroY, width, height, unit, unitCount,
  data, maxMAG,
  selectedIndexes,
  handleDotClick
}) => {
  return (
    <g 
      id={`${graphId}-axes-and-data`}
      transform={`translate(${graphAreaMargin}, ${graphAreaMargin})`}
    >
      <g id={`${graphId}-axes`}>
        <rect 
          id='mag-rect-axis'
          x={0} 
          y={0} 
          width={width}
          height={height}
          fill="none"
          stroke="black"
          strokeWidth={1}
        />
        <Axis 
          graphId={graphId}
          type='x'
          name='Step'
          mirrorNamePosition={{x: -24, y: zeroY + 5}} 
          zero={zeroY}
          length={width}
          unit={unit}
          unitCount={unitCount}
          hideLine={true}
          tickPosition="outer"
        />
        <Axis 
          graphId={graphId}
          type='y'
          name='M/Mmax'
          mirrorName={`Mmax = ${maxMAG} A/m`}
          mirrorNamePosition={{x: zeroX + 100, y: -10}} 
          zero={zeroX}
          length={height}
          unit={unit}
          unitCount={unitCount}
          hideLine={true}
          tickPosition="inner"
          grid={{
            length: width,
            width: 1,
            color: 'black',
            dashArray: [5, 4]
          }}
        />
      </g>
      {/* 
          Создавать маркеры черезе path нельзя, ибо тогда теряется почти весь их функционал
          Добавить слушатель можно только к конкретному элементу по типу <circle />
          Потому лучше отрисовывать отдельно каждый <circle /> через map массива координат
          Однако hover всё равно работать не будет и потому лучше использовать onMouseOver
          Как раз при этом достигается условие zero-css (я его только что сам придумал)
      */}
      <g 
        id={`${graphId}-data`}
      >
        <Data 
          graphId={graphId}
          type='all'
          data={data}
          selectedIndexes={selectedIndexes}
          handleDotClick={handleDotClick}
          dotFillColor='black'
          differentColors={true}
          colorsType="stereo"
        />
      </g>
    </g>
  )
}

export default AxesAndData
