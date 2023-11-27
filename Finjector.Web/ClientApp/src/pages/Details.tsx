import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import FinLoader from "../components/FinLoader";

import { AeDetails, ChartType } from "../types";
import { useGetChartDetails } from "../queries/storedChartQueries";
import { ChartDebugInfo } from "../components/ChartDebugInfo";
import { HomeLink } from "../components/HomeLink";
import { ChartLoadingError } from "../components/ChartLoadingError";
import { Button } from "reactstrap";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CopyToClipboardHover from "../shared/CopyToClipboardHover";
import CopyToClipboard from "../shared/CopyToClipboard";

const Details = () => {
  const { id, chartSegmentString } = useParams();
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

  const isPpmOrGlClassName =
    chartDetails.chartType === ChartType.PPM ? "is-ppm" : "is-gl";

  return (
    <div className="main">
      <div className="page-title mb-3">
        <h1>{chartDetails.chartType} CoA</h1>
      </div>
      <div className="row display-content-between mb-3">
        <div className="col-6">
          <HomeLink>Back</HomeLink>
        </div>
        <div className="col text-end">
          <Link
            to={`/entry/${
              id ? `${id}/${chartSegmentString}` : `${chartSegmentString}`
            }`}
          >
            <Button className="btn btn-new me-3">Edit COA</Button>
          </Link>
          <Link to="/share">
            <Button className="btn btn-new">Share COA</Button>
          </Link>
        </div>
      </div>
      <div className="card">
        <div className="row">
          <div className="col">
            This chart string is {chartDetails.isValid ? "valid" : "invalid"}
          </div>
        </div>
        <div className="row">
          <div className="col">
            {chartDetails.errors.length} errors and{" "}
            {chartDetails.warnings.length} warnings
          </div>
        </div>
        {chartDetails.errors.length > 0 && (
          <div className="col">
            <div className="row">Errors</div>
            {chartDetails.errors.map((error) => {
              return <div className="row">{error}</div>;
            })}
          </div>
        )}
        {chartDetails.hasWarnings && chartDetails.warnings.length > 0 && (
          <div className="col">
            <div className="row">Warnings</div>
            {chartDetails.warnings.map((warning) => {
              return <div className="row">{warning}</div>;
            })}
          </div>
        )}
      </div>
      <div className={`coa-details ${isPpmOrGlClassName}`}>
        <div className="coa-details-title d-flex justify-content-between align-items-center">
          <div className="col-11">
            <div className="coa-type">
              <span>{chartDetails.chartType}</span>
            </div>
            <CopyToClipboardHover
              value={chartDetails.ppmGlString}
              id="copyPpmGlString"
            >
              <h1>{chartDetails.ppmGlString}</h1>
            </CopyToClipboardHover>
          </div>
          <div className="col-1">
            <CopyToClipboard
              value={chartDetails.ppmGlString}
              id="copyPpmGlStringButton"
            >
              <div className="btn btn-link">
                <FontAwesomeIcon icon={faCopy} />
                Copy
              </div>
            </CopyToClipboard>
          </div>
        </div>
        <div className="coa-details-info unique-bg">
          {chartDetails.segmentDetails.map((segment) => {
            return (
              <div className="row">
                <div className="col-3">
                  <h4>{segment.entity}</h4>
                </div>
                <div className="col-9 coa-details-info-right">
                  <span className="fw-bold primary-font me-3">
                    {segment.code}
                  </span>{" "}
                  {segment.name}
                </div>
              </div>
            );
          })}
        </div>
        <div className="coa-details-info">
          <div className="row">
            <div className="col-3">
              <h4>Financial Officer(s)</h4>
            </div>
            <div className="col coa-details-info-right">
              {chartDetails.approvers.map((approver, i) => {
                return (
                  <div key={i}>
                    {approver.name} ({approver.email})
                  </div>
                );
              })}
            </div>
          </div>
          <div className="row">
            <div className="col-3 coa-info-title">
              <h4>Project Manager</h4>
            </div>
            <div className="col coa-details-info-right">
              {chartDetails.ppmProjectManager.name} (
              {chartDetails.ppmProjectManager.email})
            </div>
          </div>
        </div>
      </div>
      <ChartDebugInfo chartDetails={chartDetails} />
    </div>
  );
};

export default Details;