import React from "react";

import { ChartType, GlSegments, SegmentData } from "../../types";
import SegmentSearch from "./SegmentSearch";

interface Props {
  segments: GlSegments;
  setSegment: (name: string, segment: SegmentData) => void;
}

const GlEntry = (props: Props) => {
  const updateSegment = (value: SegmentData) => {
    props.setSegment(value.segmentName, value);
  };

  return (
    <div className="form-data-entry">
      <div className="row">
        <SegmentSearch
          chartType={ChartType.GL}
          segmentData={props.segments.entity}
          setSegmentValue={updateSegment}
        ></SegmentSearch>

        <SegmentSearch
          chartType={ChartType.GL}
          segmentData={props.segments.fund}
          setSegmentValue={updateSegment}
        ></SegmentSearch>

        <SegmentSearch
          chartType={ChartType.GL}
          segmentData={props.segments.department}
          setSegmentValue={updateSegment}
        ></SegmentSearch>

        <SegmentSearch
          chartType={ChartType.GL}
          segmentData={props.segments.account}
          setSegmentValue={updateSegment}
        ></SegmentSearch>

        <SegmentSearch
          chartType={ChartType.GL}
          segmentData={props.segments.purpose}
          setSegmentValue={updateSegment}
          minQueryLength={2}
        ></SegmentSearch>

        <SegmentSearch
          chartType={ChartType.GL}
          segmentData={props.segments.program}
          setSegmentValue={updateSegment}
        ></SegmentSearch>

        <SegmentSearch
          chartType={ChartType.GL}
          segmentData={props.segments.project}
          setSegmentValue={updateSegment}
        ></SegmentSearch>

        <SegmentSearch
          chartType={ChartType.GL}
          segmentData={props.segments.activity}
          setSegmentValue={updateSegment}
        ></SegmentSearch>
      </div>
    </div>
  );
};

export default GlEntry;
