import React from 'react';
import styles from './App.module.scss';
import { handleSave } from '../../utils/export';
import  { ZijdGraph, StereoGraph } from '../Main/index';

export interface IGraph {
  graphId: string;
}

function App() {
  return (
    <div className={styles.AppContainer}>
      <ZijdGraph graphId={'zijd'}/>
      <button id='SVGsave' onClick={handleSave} style={{marginTop: '24px'}}>SAVE</button>
      <StereoGraph graphId={'stereo'}/>
    </div>
  );
}

export default App;
