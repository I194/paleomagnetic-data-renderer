import React, { FC, useEffect, useState } from "react";
import { IGraph } from "../../App/App";
import { SelectableGraph, GraphSymbols, Unit} from "../../Sub";
import AxesAndData from "./AxesAndData";
import styles from "./MagGraph.module.scss";

const MagGraph: FC<IGraph> = ({ graphId }) => {

  // ToDo: 
  // 1. менять viewBox в зависимости от размера группы data (horizontal-data + vertical-data) || STOPPED
  // 2. zoom&pan
  // 3. починить отображение цвета точек - проблема сейчас в том, что не считывается корректно inc (считывается y)
  //    то есть вообще надо уже начать работать с нормальной моделью данных, а не с выдуманным массивом [][]

  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);
  const [selectableNodes, setSelectableNodes] = useState<ChildNode[]>([]);

  const demagnetizationType = 'T';

  const mag: Array<number> = [
    100, 90, 80, 60, 30, 35, 33, 30, 20, 10, 0
  ];

  const stepValues: Array<number> = [
    0, 100, 250, 300, 350, 400, 450, 500, 540, 570, 590
  ];

  const maxMag = Math.max(...mag);
  const maxStep = Math.ceil(Math.max(...stepValues) / 100) * 100;
  console.log(maxStep)

  const width = 300;
  const height = 300;

  const graphAreaMargin = 50;
  const viewWidth = width + graphAreaMargin * 2;
  const viewHeight = height + graphAreaMargin * 2;

  const unit = (width / 10);
  const unitCount = 10;
  const zeroX = (0);
  const zeroY = (height);
  
  const data: Array<[number, number]> = stepValues.map((step, index) => {
    const normalizedMAG = mag[index] / maxMag;
    const x = step * (width / maxStep);
    const y = (1 - normalizedMAG) * height;
    return [x, y];
  }); // "x" is stepValue, "y" is normalizedMAG

  // selectableNodes - все точки на графике 
  useEffect(() => {
    const elementsContainer = document.getElementById(`${graphId}-all-dots`);
    if (elementsContainer) {
      const nodes = Array.from(elementsContainer.childNodes);
      setSelectableNodes(nodes);
    }
  }, [graphId])

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
    return null;
  };

  console.log("nodes:", selectableNodes)

  return (
    <>
      <SelectableGraph
        graphId={graphId}
        width={viewWidth}
        height={viewHeight}
        selectableNodes={selectableNodes}
        selectedIndexes={selectedIndexes}
        setSelectedIndexes={setSelectedIndexes}
        nodesDuplicated={false}
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
            unitCount={unitCount}
            data={data}
            maxMAG={maxMag}
            selectedIndexes={selectedIndexes}
            handleDotClick={handleDotClick}
          />
          <GraphSymbols 
            title1="Down" id1={`${graphId}-d-data`} 
            title2="Up" id2={`${graphId}-u-data`}
            viewHeight={viewHeight} viewWidth={viewWidth}
            disabled={true}
          />
          <Unit 
            label={`10 degrees`} 
            viewHeight={viewHeight} viewWidth={viewWidth}
          />
        </g>
      </SelectableGraph>
    </>
  )
}

export default MagGraph;