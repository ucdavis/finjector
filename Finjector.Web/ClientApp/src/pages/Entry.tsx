import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import ChartTypeSelector from "../components/ChartTypeSelector";
import GlEntry from "../components/GlEntry";
import PpmEntry from "../components/PpmEntry";

import { Chart, ChartData, ChartType, SegmentData } from "../types";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

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
import NameEntry from "../components/NameEntry";
import { mapSegmentQueryData } from "../util/segmentMapping";
import EditButtons from "../components/EditButtons";

import { Link } from "react-router-dom";

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

      mapSegmentQueryData(
        chart.chartType,
        savedChartData,
        savedChartQuery.data
      );

      setChartData(savedChartData);
    }
  }, [savedChartQuery.data]);

  // if we have a saved chart, make sure it's been loaded before continuing
  if (id && !savedChart.id) {
    return <div>Loading...</div>;
  }

  return (
    <div className="main">
      <Link className="back-link" to="/landing">
        <FontAwesomeIcon icon={faArrowLeft} />
        Back
      </Link>

      <h2>Chart Type</h2>
      <ChartTypeSelector
        chartType={chartData.chartType}
        setChartType={(chartType) =>
          setChartData((d) => ({ ...d, chartType: chartType }))
        }
      />
      <div className="mt-4 mb-4">
        <h2>{chartData.chartType} Chart Details</h2>
        {chartData.chartType === ChartType.GL ? (
          <GlEntry
            segments={chartData.glSegments}
            setSegment={(name: string, segment: SegmentData) =>
              setChartData((c) => ({
                ...c,
                glSegments: { ...c.glSegments, [name]: segment },
              }))
            }
          />
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
        <h2>CoA Name</h2>
        <NameEntry
          chart={savedChart}
          updateDisplayName={(n) =>
            setSavedChart((c) => ({ ...c, displayName: n }))
          }
        />
        <CoaDisplay chartData={chartData} />
        {savedChart.id ? (
          <EditButtons chartData={chartData} savedChart={savedChart} />
        ) : (
          <SaveAndUseButton chartData={chartData} savedChart={savedChart} />
        )}
      </div>

      <pre>
        {JSON.stringify(
          chartData.chartType === ChartType.PPM
            ? chartData.ppmSegments
            : chartData.glSegments,
          null,
          2
        )}
      </pre>
    </div>
  );
};

export default Entry;
