import React from "react";

import { ChartType, PpmSegments, SegmentData } from "../types";

import SegmentSearch from "./SegmentSearch";

interface Props {
  segments: PpmSegments;
  setSegment: (name: string, segment: SegmentData) => void;
}

const PpmEntry = (props: Props) => {
  const updateSegment = (value: SegmentData) => {
    props.setSegment(value.segmentName, value);
  };

  return (
    <div className="form-data-entry">
      <form className="row">
        <SegmentSearch
          chartType={ChartType.PPM}
          segmentData={props.segments.project}
          setSegmentValue={updateSegment}
        ></SegmentSearch>

        <SegmentSearch
          chartType={ChartType.PPM}
          segmentData={props.segments.task}
          segmentDependency={props.segments.project}
          segmentDependencyRequired={true}
          setSegmentValue={updateSegment}
        ></SegmentSearch>

        <SegmentSearch
          chartType={ChartType.PPM}
          segmentData={props.segments.organization}
          setSegmentValue={updateSegment}
        ></SegmentSearch>

        <SegmentSearch
          chartType={ChartType.PPM}
          segmentData={props.segments.expenditureType}
          setSegmentValue={updateSegment}
        ></SegmentSearch>
      </form>

      <pre>{JSON.stringify(props.segments, null, 2)}</pre>
    </div>
  );
};

export default PpmEntry;
