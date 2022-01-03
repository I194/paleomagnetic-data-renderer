import React, { FC } from "react";
import styles from "./Unit.module.scss";

interface IUnit {
  label: string;
  viewHeight: number;
}

const Unit: FC<IUnit> = ({ label, viewHeight }) => {
  return (
    <text id='graph-unit' x={10} y={viewHeight - 10} className={styles.unitText}>
      Unit={label}
    </text>
  )
}

export default Unit;