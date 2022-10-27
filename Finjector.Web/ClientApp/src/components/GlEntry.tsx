import React from "react";

import { ChartType, GlSegments, SegmentData } from "../types";
import SegmentSearch from "./SegmentSearch";

interface Props {
  segments: GlSegments;
  setSegment: (name: string, segment: SegmentData) => void;
}

const GlEntry = (props: Props) => {
  const updateSegment = (key: string, value: SegmentData) => {
    props.setSegment(key, value);
  };

  return (
    <div className="form-data-entry">
      <form className="row">
        <SegmentSearch
          chartType={ChartType.GL}
          segmentName="entity"
          segmentData={props.segments.entity}
          setSegmentValue={(v) => updateSegment("entity", v)}
        ></SegmentSearch>

        <SegmentSearch
          chartType={ChartType.GL}
          segmentName="fund"
          segmentData={props.segments.fund}
          setSegmentValue={(v) => updateSegment("fund", v)}
        ></SegmentSearch>

        <SegmentSearch
          chartType={ChartType.GL}
          segmentName="department"
          segmentData={props.segments.department}
          setSegmentValue={(v) => updateSegment("department", v)}
        ></SegmentSearch>

        <SegmentSearch
          chartType={ChartType.GL}
          segmentName="purpose"
          segmentData={props.segments.purpose}
          setSegmentValue={(v) => updateSegment("purpose", v)}
        ></SegmentSearch>

        <SegmentSearch
          chartType={ChartType.GL}
          segmentName="account"
          segmentData={props.segments.account}
          setSegmentValue={(v) => updateSegment("account", v)}
        ></SegmentSearch>

        <SegmentSearch
          chartType={ChartType.GL}
          segmentName="project"
          segmentData={props.segments.project}
          setSegmentValue={(v) => updateSegment("project", v)}
        ></SegmentSearch>

        <SegmentSearch
          chartType={ChartType.GL}
          segmentName="program"
          segmentData={props.segments.program}
          setSegmentValue={(v) => updateSegment("program", v)}
        ></SegmentSearch>

        <SegmentSearch
          chartType={ChartType.GL}
          segmentName="activity"
          segmentData={props.segments.activity}
          setSegmentValue={(v) => updateSegment("activity", v)}
        ></SegmentSearch>
      </form>

      <pre>{JSON.stringify(props.segments, null, 2)}</pre>
    </div>
  );
};

export default GlEntry;
