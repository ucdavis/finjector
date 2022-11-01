import React from "react";
import { Input } from "reactstrap";

import { Chart } from "../types";

interface Props {
  chart: Chart;
  updateDisplayName: (name: string) => void;
}
const NameEntry = (props: Props) => {
  return (
    <>
      <div className="chart-type">
        <form>
          <p>Give your CoA a name, something to remember it by</p>
          <Input
            required
            type="text"
            className="form-control"
            valid={props.chart.displayName.length > 0}
            invalid={props.chart.displayName.length === 0}
            value={props.chart.displayName}
            onChange={(e) => props.updateDisplayName(e.target.value)}
          />
        </form>
      </div>
    </>
  );
};

export default NameEntry;
