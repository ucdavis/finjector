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
      <div className="col-md-6">
        <h2>Name</h2>
        <div className="chart-type">
          <form>
            <p>Give your chart string a name to remember it by</p>
            <Input
              required
              type="text"
              className="form-control"
              valid={props.chart.name.length > 0}
              invalid={props.chart.name.length === 0}
              value={props.chart.name}
              onChange={(e) => props.updateName(e.target.value)}
            />
          </form>
        </div>
      </div>
    </>
  );
};

export default NameEntry;
