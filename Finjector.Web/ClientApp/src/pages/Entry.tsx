import React from "react";
import { useParams } from "react-router-dom";
import ChartTypeSelector from "../components/ChartTypeSelector";
import GlEntry from "../components/GlEntry";
import PpmEntry from "../components/PpmEntry";

import { ChartType } from "../types";

// CSS
// https://github.com/ericgio/react-bootstrap-typeahead/issues/713 warning w/ bootstrap 5
import "react-bootstrap-typeahead/css/Typeahead.css";
// import "react-bootstrap-typeahead/css/Typeahead.bs5.css";

const Entry = () => {
  const { chart } = useParams();

  const [chartSegmentString, setChartSegmentString] = React.useState<string>(
    chart || "CP00000001-000001-0000000-000000-0000000-00000"
  );
  const [chartType, setChartType] = React.useState<ChartType>(ChartType.PPM);

  return (
    <div>
      <h1>Entry</h1>
      <hr />
      <ChartTypeSelector chartType={chartType} setChartType={setChartType} />
      <hr />
      <h2>{chartType} Chart Details</h2>
      {chartType === ChartType.GL ? <GlEntry /> : <PpmEntry chart={chartSegmentString} setChart={setChartSegmentString} />}
    </div>
  );
};

export default Entry;
