import React, { FC } from "react";

const ZijdGraph: FC = () => {

  return (
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="300px" height="300px" id='mySVG'>
      <line x1="150" y1="0" x2="150" y2="300" stroke="black" strokeWidth="2" />
      <line x1="0" y1="150" x2="300" y2="150" stroke="black" strokeWidth="2" />
      
      <defs>
        <marker id="mC" markerWidth="10" markerHeight="10" refX="5" refY="5">
          <circle cx="5" cy="5" r="2" style={{fill: 'black', stroke: 'black'}}/>
        </marker>
      </defs>
      <path 
        d="M20,20 L25,70 L50,40 L39,72, L110,119, L118,129, L134,141, L150,150" 
        markerStart="url(#mC)" 
        markerMid="url(#mC)" 
        markerEnd="url(#mC)" 
        fill="none" 
        stroke=" black" 
      />
    </svg>
  )
}

export default ZijdGraph;