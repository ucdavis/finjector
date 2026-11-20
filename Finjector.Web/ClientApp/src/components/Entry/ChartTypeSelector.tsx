import React from "react";

import { ChartType } from "../../types";

interface Props {
  chartType: string;
  setChartType: (chartType: ChartType) => void;
}
const ChartTypeSelector = (props: Props) => {
  const { chartType, setChartType } = props;

  const activeClass = "btn-outline-active";

  return (
    <>
      <fieldset className="chart-type">
        <legend className="float-none fs-6">
          Select which type of chart string you will build
        </legend>
        <input
          type="radio"
          className="btn-check"
          name="options"
          id="option1"
          autoComplete="off"
          checked={chartType === ChartType.GL}
          onChange={() => setChartType(ChartType.GL)}
        />
        <label
          className={`btn btn-finjector btn-gl me-3 ${
            chartType === ChartType.GL ? activeClass : ""
          }`}
          htmlFor="option1"
        >
          {chartType === ChartType.GL && <span aria-hidden="true">✓ </span>}
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
        <label
          className={`btn btn-finjector btn-ppm ${
            chartType === ChartType.PPM ? activeClass : ""
          }`}
          htmlFor="option2"
        >
          {chartType === ChartType.PPM && <span aria-hidden="true">✓ </span>}
          PPM
        </label>
      </fieldset>
    </>
  );
};

export default ChartTypeSelector;
