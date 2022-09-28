import React from "react";

import { ChartType } from "../types";

interface Props {
  chartType: string;
  setChartType: (chartType: ChartType) => void;
}
const ChartTypeSelector = (props: Props) => {
  const { chartType, setChartType } = props;

  return (
    <>
      <h2>Type of CoA?</h2>
      <p>Select which type of account you will build</p>
      <div>
        <input
          type="radio"
          className="btn-check"
          name="options"
          id="option1"
          autoComplete="off"
          checked={chartType === ChartType.GL}
          onChange={() => setChartType(ChartType.GL)}
        />
        <label className="btn btn-outline-primary" htmlFor="option1">
          GL
        </label>

        <input
          type="radio"
          className="btn-check"
          name="options"
          id="option2"
          autoComplete="off"
          checked={chartType === ChartType.PPM}
          onChange={() => setChartType(ChartType.PPM)}
        />
        <label className="btn btn-outline-primary" htmlFor="option2">
          PPM
        </label>
      </div>
    </>
  );
};

export default ChartTypeSelector;
