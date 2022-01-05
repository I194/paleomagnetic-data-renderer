import React, { FC, useEffect, useState } from "react";
import { IGraph } from "../../App/App";
import { SelectableGraph, GraphSymbols, Unit} from "../../Sub";
import AxesAndData from "./AxesAndData";
import styles from "./ZijdGraph.module.scss";

const StereoGraph: FC<IGraph> = ({ graphId }) => {

  // ToDo: 
  // 1. менять viewBox в зависимости от размера группы data (horizontal-data + vertical-data) || STOPPED
  // 2. zoom&pan

  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);
  const [selectableNodes, setSelectableNodes] = useState<ChildNode[]>([]);

  const horizontalProjectionData: Array<[number, number]> = [
    [20, 20], [25, 70], [50, 40], [39, 72], [110, 119], [118, 129], [134, 141], [150, 150]
  ]; // "x" is Inclination [-90, 90], "y" is Declination [0, 360]
  const verticalProjectionData: Array<[number, number]> = [
    [20, 170], [25, 190], [50, 210], [39, 132], [110, 158], [118, 169], [134, 149], [150, 150]
  ]; // "x" is Inclination [-90, 90], "y" is Declination [0, 360]

  const width = 300;
  const height = 300;

  const graphAreaMargin = 50;
  const viewWidth = width + graphAreaMargin * 2;
  const viewHeight = height + graphAreaMargin * 2;

  const unit = (width / 18);
  const unitCount = 18;
  const zeroX = (width / 2);
  const zeroY = (height / 2);

  // selectableNodes - все точки на графике 
  useEffect(() => {
    const elementsContainerU = document.getElementById(`${graphId}-u-dots`);
    const elementsContainerD = document.getElementById(`${graphId}-d-dots`);
    if (elementsContainerU && elementsContainerD) {
      const nodes = Array.from(elementsContainerU.childNodes).concat(Array.from(elementsContainerD.childNodes));
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
            upData={horizontalProjectionData}
            downData={verticalProjectionData}
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

export default StereoGraph;