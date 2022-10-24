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
      <div className="chart-type">
        <p>Select which type of account you will build</p>
        <input
          type="radio"
          className="btn-check"
          name="options"
          id="option1"
          autoComplete="off"
          checked={chartType === ChartType.GL}
          onChange={() => setChartType(ChartType.GL)}
        />
        <label className="btn btn-outline me-3" htmlFor="option1">
          GL CoA
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
        <label className="btn btn-outline btn-outline-active" htmlFor="option2">
          PPM CoA
        </label>
      </div>
    </>
  );
};

export default ChartTypeSelector;
