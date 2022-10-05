import React from "react";
import { ChartData, ChartType } from "../types";
import { toGlSegmentString, toPpmSegmentString } from "../util/segmentValidation";

interface Props {
  chartData: ChartData;
}

const CoaDisplay = (props: Props) => {
  const { chartType, glSegments, ppmSegments } = props.chartData;

  // TODO: either don't show anything, or show 0's if no data or segment invalid?

  const chartString = chartType === ChartType.GL ? toGlSegmentString(glSegments) : toPpmSegmentString(ppmSegments);

  return <span>{chartString}</span>;
};

export default CoaDisplay;
