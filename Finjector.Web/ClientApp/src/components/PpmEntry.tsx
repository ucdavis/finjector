import React from "react";
import { ChartType, PpmSegments } from "../types";

import SegmentSearch from "./SegmentSearch";

const PpmEntry = () => {
  const [ppmSegments, setPpmSegments] = React.useState<PpmSegments>({});

  return (
    <div>
      <h1>PpmEntry</h1>
      <SegmentSearch
        chartType={ChartType.PPM}
        segmentName="Project"
        segmentValue={ppmSegments.project}
        setSegmentValue={(v) => setPpmSegments((p) => ({ ...p, project: v }))}
      ></SegmentSearch>
    </div>
  );
};

export default PpmEntry;
