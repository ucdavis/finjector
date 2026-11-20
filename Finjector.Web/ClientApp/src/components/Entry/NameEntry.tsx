import React from "react";
import { Input } from "reactstrap";

import { Coa } from "../../types";

interface Props {
  chart: Coa;
  updateName: (name: string) => void;
}
const NameEntry = (props: Props) => {
  return (
    <>
      <h2 id="chart-name-label">Name (required)</h2>
      <div className="chart-type">
        <p id="chart-name-help">Give your chart string a name to remember it by.</p>
        <Input
          required
          aria-labelledby="chart-name-label"
          aria-describedby="chart-name-help"
          type="text"
          className="form-control"
          valid={props.chart.name.length > 0}
          invalid={props.chart.name.length === 0}
          value={props.chart.name}
          onChange={(e) => props.updateName(e.target.value)}
        />
      </div>
    </>
  );
};

export default NameEntry;
