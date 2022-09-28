import React from "react";

import { ChartType } from "../types";
import {
  fromPpmSegmentString,
  toPpmSegmentString,
} from "../util/segmentValidation";

import SegmentSearch from "./SegmentSearch";

interface Props {
  chart: string;
  setChart: (chart: string) => void;
}

const PpmEntry = (props: Props) => {
  const ppmSegments = fromPpmSegmentString(props.chart);

  const updateSegment = (key: string, value: string) => {
    const newSegments = { ...ppmSegments, [key]: value };
    props.setChart(toPpmSegmentString(newSegments));
  };

  return (
    <div>
      <h1>PpmEntry</h1>
      <SegmentSearch
        chartType={ChartType.PPM}
        segmentName="Project"
        segmentValue={ppmSegments.project}
        setSegmentValue={(v) => updateSegment("project", v)}
      ></SegmentSearch>
    </div>
  );
};

export default PpmEntry;
