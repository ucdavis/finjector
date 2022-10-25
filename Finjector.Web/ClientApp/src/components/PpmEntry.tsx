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
    <div className="form-data-entry">
      <form className="row">
        <SegmentSearch
          chartType={ChartType.PPM}
          segmentName="project"
          segmentData={props.segments.project}
          setSegmentValue={(v) => updateSegment("project", v)}
        ></SegmentSearch>

        <SegmentSearch
          chartType={ChartType.PPM}
          segmentName="task"
          segmentData={props.segments.task}
          segmentDependency={props.segments.project}
          segmentDependencyRequired={true}
          setSegmentValue={(v) => updateSegment("task", v)}
        ></SegmentSearch>

        <SegmentSearch
          chartType={ChartType.PPM}
          segmentName="organization"
          segmentData={props.segments.organization}
          setSegmentValue={(v) => updateSegment("organization", v)}
        ></SegmentSearch>

        <SegmentSearch
          chartType={ChartType.PPM}
          segmentName="expenditureType"
          segmentData={props.segments.expenditureType}
          setSegmentValue={(v) => updateSegment("expenditureType", v)}
        ></SegmentSearch>
      </form>

      <pre>{JSON.stringify(props.segments, null, 2)}</pre>
    </div>
  );
};

export default PpmEntry;
