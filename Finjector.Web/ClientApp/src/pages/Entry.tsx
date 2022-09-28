import React from "react";
import { useParams } from "react-router-dom";
import ChartTypeSelector from "../components/ChartTypeSelector";
import GlEntry from "../components/GlEntry";
import PpmEntry from "../components/PpmEntry";

import { ChartType } from "../types";

const Entry = () => {
  const { chart } = useParams();

  // TODO: set based on chart from params
  const [chartType, setChartType] = React.useState<ChartType>(ChartType.PPM);

  return (
    <div>
      <h1>Entry</h1>
      <hr />
      <ChartTypeSelector chartType={chartType} setChartType={setChartType} />
      <hr />
      <h2>{chartType} Chart Details</h2>
      {chartType === ChartType.GL ? <GlEntry /> : <PpmEntry />}
    </div>
  );
};

export default Entry;
