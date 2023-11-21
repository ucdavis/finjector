import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import FinLoader from "../components/FinLoader";

import { AeDetails, ChartType } from "../types";
import { useGetChartDetails } from "../queries/storedChartQueries";
import { ChartDebugInfo } from "../components/ChartDebugInfo";
import { HomeLink } from "../components/HomeLink";
import { ChartLoadingError } from "../components/ChartLoadingError";
import { Button } from "reactstrap";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Details = () => {
  const { id, chartSegmentString } = useParams();
  console.log("id", id);
  console.log("chartSegmentString", chartSegmentString);

  const chartDetailsQuery = useGetChartDetails(chartSegmentString || "");

  const [chartDetails, setSavedChart] = React.useState<AeDetails>({
    isValid: false,
    chartType: "",
    chartStringType: ChartType.PPM,
    errors: [],
    warnings: [],
    segmentDetails: [
      {
        order: 0,
        entity: null,
        code: null,
        name: null,
      },
    ],
    approvers: [
      {
        firstName: null,
        lastName: null,
        email: null,
        name: "",
      },
    ],
    ppmProjectManager: {
      firstName: null,
      lastName: null,
      email: null,
      name: "",
    },
    ppmGlString: "",
    hasWarnings: false,
  });

  // if we load up new data, update the chart
  useEffect(() => {
    if (chartDetailsQuery.data) {
      const chart = chartDetailsQuery.data;
      setSavedChart(chart);
    }
  }, [chartDetailsQuery.data]);

  if (chartDetailsQuery.isError) {
    return (
      <>
        <ChartLoadingError />
        <hr />
        <HomeLink>Go Back</HomeLink>
      </>
    );
  }

  // make sure it's been loaded before continuing
  if (id && !chartDetails.ppmGlString) {
    return <FinLoader />;
  }

  return (
    <div className="main">
      <div className="row">
        <div className="col">
          <HomeLink>Back</HomeLink>
        </div>
        <div>
          <Button className="btn btn-primary">Edit COA</Button>
          <Button className="btn btn-primary">Share COA</Button>
        </div>
      </div>
      <div className="mt-4 mb-4">
        <h2>{chartDetails.chartType} Chart Details</h2>
        <div className="row-big">
          <div className="segment-title">{chartDetails.chartType}</div>
          <div className="row">
            <div className="col">
              <h1>{chartDetails.ppmGlString}</h1>
            </div>
            <div className="col-1">
              <Link
                to={`/selected/${id}/${chartDetails.ppmGlString}`}
                className="btn btn-link"
              >
                <FontAwesomeIcon icon={faPaperPlane} />
                Use
              </Link>
            </div>
          </div>
          <div className="card">
            {chartDetails.segmentDetails.map((segment) => {
              return (
                <div className="row">
                  <div className="col-3 segment-title">{segment.entity}</div>
                  <div className="col">
                    <span className="details-segment-info">{segment.code}</span>{" "}
                    {segment.name}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="card">
            <div className="row">
              <div className="col-3 segment-title">Financial Officer(s)</div>
              <div className="col">
                {chartDetails.approvers.map((approver) => {
                  return (
                    <div className="row">
                      {approver.name} ({approver.email})
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="card">
            <div className="row">
              This chart string is {chartDetails.isValid ? "valid" : "invalid"}
            </div>
            <div className="row">
              {chartDetails.errors.length} errors and{" "}
              {chartDetails.warnings.length} warnings
            </div>
            {chartDetails.errors.length > 0 && (
              <div>
                <div className="row">Errors</div>
                {chartDetails.errors.map((error) => {
                  return <div className="row">{error}</div>;
                })}
              </div>
            )}
            {chartDetails.hasWarnings && chartDetails.warnings.length > 0 && (
              <div>
                <div className="row">Warnings</div>
                {chartDetails.warnings.map((warning) => {
                  return <div className="row">{warning}</div>;
                })}
              </div>
            )}
          </div>
          <ChartDebugInfo chartDetails={chartDetails} />
        </div>
      </div>
    </div>
  );
};

export default Details;
