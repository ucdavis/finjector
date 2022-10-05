import React from "react";
import { useParams } from "react-router-dom";
import ChartTypeSelector from "../components/ChartTypeSelector";
import GlEntry from "../components/GlEntry";
import PpmEntry from "../components/PpmEntry";

import { ChartData, ChartType, SegmentData } from "../types";

// CSS
// https://github.com/ericgio/react-bootstrap-typeahead/issues/713 warning w/ bootstrap 5
import "react-bootstrap-typeahead/css/Typeahead.css";
import "react-bootstrap-typeahead/css/Typeahead.bs5.css";
import {
  buildInitialGlSegments,
  buildInitialPpmSegments,
} from "../util/segmentHelpers";
import CoaDisplay from "../components/CoaDisplay";
import SaveAndUseButton from "../components/SaveAndUseButton";


const Entry = () => {
  const { chart } = useParams();

  // TODO: use chart to set initial state if present

  const [chartData, setChartData] = React.useState<ChartData>({
    chartType: ChartType.PPM,
    glSegments: buildInitialGlSegments(),
    ppmSegments: buildInitialPpmSegments(),
  });

  return (
    <div className="p-3">
      <h1>Entry</h1>
      <hr />
      <ChartTypeSelector
        chartType={chartData.chartType}
        setChartType={(chartType) =>
          setChartData((d) => ({ ...d, chartType: chartType }))
        }
      />
      <hr />
      <h2>{chartData.chartType} Chart Details</h2>
      {chartData.chartType === ChartType.GL ? (
        <GlEntry />
      ) : (
        <PpmEntry
          segments={chartData.ppmSegments}
          setSegment={(name: string, segment: SegmentData) =>
            setChartData((c) => ({
              ...c,
              ppmSegments: { ...c.ppmSegments, [name]: segment },
            }))
          }
        />
      )}
      <CoaDisplay chartData={chartData} />
      <SaveAndUseButton chartData={chartData} />
    </div>
  );
};

export default Entry;
