import React from "react";

import { ChartType, PpmSegments, SegmentData } from "../types";

import SegmentSearch from "./SegmentSearch";

interface Props {
  segments: PpmSegments;
  setSegment: (name: string, segment: SegmentData) => void;
}

const PpmEntry = (props: Props) => {
  const updateSegment = (key: string, value: SegmentData) => {
    props.setSegment(key, value);
  };

  return (
    <div>
      <h1>PpmEntry</h1>
      <SegmentSearch
        chartType={ChartType.PPM}
        segmentName="project"
        segmentData={props.segments.project}
        setSegmentValue={(v) => updateSegment("project", v)}
      ></SegmentSearch>
    </div>
  );
};

export default PpmEntry;
