import React from "react";

import { Chart } from "../types";

interface Props {
  chart: Chart;
  updateDisplayName: (name: string) => void;
}
const NameEntry = (props: Props) => {
  return (
    <>
      <div className="chart-type">
        <p>Give your CoA a name, something to remember it by</p>
        <input
          type="text"
          className="form-control"
          value={props.chart.displayName}
          onChange={(e) => props.updateDisplayName(e.target.value)}
        />
      </div>
    </>
  );
};

export default NameEntry;
