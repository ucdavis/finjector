import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import ChartTypeSelector from "../components/ChartTypeSelector";
import GlEntry from "../components/GlEntry";
import PpmEntry from "../components/PpmEntry";

import { Chart, ChartData, ChartType, SegmentData } from "../types";

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
import { useGetSavedChartWithData } from "../queries/storedChartQueries";
import {
  fromGlSegmentString,
  fromPpmSegmentString,
} from "../util/segmentValidation";

const Entry = () => {
  const { id } = useParams();

  const savedChartQuery = useGetSavedChartWithData(id || "");

  const [savedChart, setSavedChart] = React.useState<Chart>({
    id: "",
    chartType: ChartType.GL,
    displayName: "",
    segmentString: "",
  });

  // in progress chart data
  const [chartData, setChartData] = React.useState<ChartData>({
    chartType: ChartType.PPM,
    glSegments: buildInitialGlSegments(),
    ppmSegments: buildInitialPpmSegments(),
  });

  // if we load up new data, update the chart
  useEffect(() => {
    console.log(savedChartQuery.data);
    if (savedChartQuery.data) {
      const { chart } = savedChartQuery.data;
      setSavedChart(chart);

      const savedChartData: ChartData = {
        chartType: chart.chartType,
        glSegments:
          chart.chartType === ChartType.GL
            ? fromGlSegmentString(chart.segmentString)
            : buildInitialGlSegments(),
        ppmSegments:
          chart.chartType === ChartType.PPM
            ? fromPpmSegmentString(chart.segmentString)
            : buildInitialPpmSegments(),
      };

      // TODO: this is hacky until we have a unified way of loading/validating segments
      // TODO: move to validation helper function after mapping return
      if (chart.chartType === ChartType.PPM) {
        const segmentMap = savedChartQuery.data.validateResponse.segments;

        Object.keys(savedChartData.ppmSegments).forEach(
          (segmentName: string) => {
            const segment = (savedChartData.ppmSegments as any)[segmentName];
            const mapValue = segmentMap[segmentName];

            if (mapValue) {
              segment.name = mapValue;
              segment.isValid = true;
            }
          }
        );
      } else if (chart.chartType === ChartType.GL) {
        // not supported yet
      }

      setChartData(savedChartData);
    }
  }, [savedChartQuery.data]);

  // if we have a saved chart, make sure it's been loaded before continuing
  if (id && !savedChart.id) {
    return <div>Loading...</div>;
  }

  return (
    <div className="main">
      <h1>Create new Chart</h1>
      <ChartTypeSelector
        chartType={chartData.chartType}
        setChartType={(chartType) =>
          setChartData((d) => ({ ...d, chartType: chartType }))
        }
      />
      <div className="mt-4 mb-4">
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
        <button type="button" className="btn btn-primary">
          Primary
        </button>
        <button type="button" className="btn btn-secondary">
          Secondary
        </button>
        <button type="button" className="btn btn-success">
          Success
        </button>
        <button type="button" className="btn btn-danger">
          Danger
        </button>
        <button type="button" className="btn btn-warning">
          Warning
        </button>
        <button type="button" className="btn btn-link">
          Link
        </button>
      </div>
    </div>
  );
};

export default Entry;
