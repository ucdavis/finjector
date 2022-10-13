import React from "react";
import { ChartData } from "../types";
import { chartDataValid, toSegmentString } from "../util/segmentValidation";

interface Props {
  chartData: ChartData;
}

const CoaDisplay = (props: Props) => {
  // TODO: either don't show anything, or show 0's if no data or segment invalid?

  const chartString = toSegmentString(props.chartData);

  return (
    <span>
      {chartDataValid(props.chartData) ? "valid" : "invalid"} :: {chartString}
    </span>
  );
};

export default CoaDisplay;
