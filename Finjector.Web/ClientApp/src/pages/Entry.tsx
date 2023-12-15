import React, { useEffect } from "react";
import { Navigate, useParams, useSearchParams } from "react-router-dom";
import ChartTypeSelector from "../components/Entry/ChartTypeSelector";
import GlEntry from "../components/Entry/GlEntry";
import PpmEntry from "../components/Entry/PpmEntry";
import FinLoader from "../components/Shared/FinLoader";

import { Coa, ChartData, ChartType, SegmentData } from "../types";

// CSS
// https://github.com/ericgio/react-bootstrap-typeahead/issues/713 warning w/ bootstrap 5
import "react-bootstrap-typeahead/css/Typeahead.css";
import "react-bootstrap-typeahead/css/Typeahead.bs5.css";
import {
  buildInitialGlSegments,
  buildInitialPpmSegments,
} from "../util/segmentHelpers";
import CoaDisplay from "../components/Entry/CoaDisplay";
import SaveAndUseButton from "../components/Entry/SaveAndUseButton";
import { useGetSavedChartWithData } from "../queries/storedChartQueries";
import {
  fromGlSegmentString,
  fromPpmSegmentString,
  isGlSegmentString,
} from "../util/segmentValidation";
import NameEntry from "../components/Entry/NameEntry";
import {
  mapSegmentCodeToName,
  mapSegmentQueryData,
} from "../util/segmentMapping";
import EntryEditButtons from "../components/Entry/EntryEditButtons";
import { ChartDebugInfo } from "../components/Shared/ChartDebugInfo";
import { ChartLoadingError } from "../components/Shared/ChartLoadingError";
import FolderSearch from "../components/Entry/FolderSearch";

const Entry = () => {
  const { chartId, chartSegmentString } = useParams();
  const [searchParams] = useSearchParams();
  const saveInFolderId = searchParams?.get("folderId")
    ? parseInt(searchParams.get("folderId") || "")
    : 0;

  const savedChartQuery = useGetSavedChartWithData(chartId || "");

  const [savedChart, setSavedChart] = React.useState<Coa>({
    id: 0,
    chartType: ChartType.PPM,
    name: "",
    segmentString: "",
    folderId: saveInFolderId,
    updated: new Date(),
  });

  // in progress chart data
  const [chartData, setChartData] = React.useState<ChartData>(() => {
    const initializeFromGlSegmentString =
      chartSegmentString && isGlSegmentString(chartSegmentString);

    return {
      chartType: initializeFromGlSegmentString ? ChartType.GL : ChartType.PPM,
      glSegments: initializeFromGlSegmentString
        ? mapSegmentCodeToName(fromGlSegmentString(chartSegmentString, true))
        : buildInitialGlSegments(),
      ppmSegments:
        chartSegmentString && !initializeFromGlSegmentString
          ? mapSegmentCodeToName(fromPpmSegmentString(chartSegmentString, true))
          : buildInitialPpmSegments(),
    };
  });

  // if we load up new data, update the chart
  useEffect(() => {
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

  if (chartSegmentString && chartSegmentString.indexOf("-") === -1) {
    // if we have a chart segment string, but it doesn't have a dash, it's probably a chart id
    return <Navigate to={`/locator/entry/${chartSegmentString}`} />;
  }

  const changeChartType = (chartType: ChartType) => {
    setChartData((d) => ({ ...d, chartType: chartType }));
    setSavedChart((c) => ({ ...c, chartType: chartType }));
  };

  if (savedChartQuery.isError) {
    return (
      <>
        <ChartLoadingError />
        <hr />
      </>
    );
  }

  // if we have a saved chart, make sure it's been loaded before continuing
  if (chartId && !savedChart.id) {
    return <FinLoader />;
  }

  return (
    <div className="main">
      <div className="page-title mb-3">
        <h1>{chartId ? "Edit Chart String" : "Create Chart String"}</h1>
      </div>

      <h2>Chart Type</h2>
      <ChartTypeSelector
        chartType={chartData.chartType}
        setChartType={changeChartType}
      />
      <div className="mt-4 mb-4">
        <h2>{chartData.chartType} Chart String Details</h2>
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
        <hr />
        <CoaDisplay chartData={chartData} />
        <hr />

        <div className="row">
          <FolderSearch
            selectedFolderId={savedChart.folderId}
            updateFolderId={(folderId) =>
              setSavedChart((c) => ({ ...c, folderId }))
            }
          />
          <NameEntry
            chart={savedChart}
            updateName={(n) => setSavedChart((c) => ({ ...c, name: n }))}
          />
        </div>
        <div className="row mb-5">
          <div className="col-md-6">
            <div className="form-text">
              Current Team: {savedChartQuery.data?.chart.folder?.team?.name}
              <br />
              Current Folder: {savedChartQuery.data?.chart.folder?.name}
            </div>
          </div>
        </div>

        {savedChart.id ? (
          <EntryEditButtons chartData={chartData} savedChart={savedChart} />
        ) : (
          <SaveAndUseButton chartData={chartData} savedChart={savedChart} />
        )}
      </div>
      <ChartDebugInfo chartData={chartData} />
    </div>
  );
};

export default Entry;
