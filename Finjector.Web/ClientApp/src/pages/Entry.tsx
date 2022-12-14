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
import NameEntry from "../components/NameEntry";
import { mapSegmentQueryData } from "../util/segmentMapping";
import EditButtons from "../components/EditButtons";
import { ChartDebugInfo } from "../components/ChartDebugInfo";
import { HomeLink } from "../components/HomeLink";
import { ChartLoadingError } from "../components/ChartLoadingError";

const Entry = () => {
  const { id } = useParams();

  const savedChartQuery = useGetSavedChartWithData(id || "");

  const [savedChart, setSavedChart] = React.useState<Chart>({
    id: "",
    chartType: ChartType.PPM,
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

  const changeChartType = (chartType: ChartType) => {
    setChartData((d) => ({ ...d, chartType: chartType }));
    setSavedChart((c) => ({ ...c, chartType: chartType }));
  };

  if (savedChartQuery.isError) {
    return (
      <>
        <ChartLoadingError />
        <hr />
        <HomeLink>Go Back</HomeLink>
      </>
    );
  }

  // if we have a saved chart, make sure it's been loaded before continuing
  if (id && !savedChart.id) {
    return (
      <div className="loading-wrapper">
        <img src="/media/loading.gif" alt="Money sign with colors" />
        <p>Loading ...</p>
      </div>
    );
  }

  return (
    <div className="main">
      <HomeLink>Back</HomeLink>

      <h2>Chart Type</h2>
      <ChartTypeSelector
        chartType={chartData.chartType}
        setChartType={changeChartType}
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
      <ChartDebugInfo chartData={chartData} />
    </div>
  );
};

export default Entry;
