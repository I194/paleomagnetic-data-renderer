import React from 'react';
import styles from './App.module.scss';
import { handleSave } from '../../utils/export';
import  { ZijdGraph } from '../Main/index';

function App() {
  return (
    <div className={styles.AppContainer}>
      <ZijdGraph />
      <button id='SVGsave' onClick={handleSave} style={{marginTop: '24px'}}>SAVE</button>
    </div>
  );
}

export default App;
