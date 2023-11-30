import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import FinLoader from "../components/FinLoader";

import { AeDetails, ChartType } from "../types";
import { useGetChartDetails } from "../queries/storedChartQueries";
import { ChartDebugInfo } from "../components/ChartDebugInfo";
import { HomeLink } from "../components/HomeLink";
import { ChartLoadingError } from "../components/ChartLoadingError";
import { Alert, Button } from "reactstrap";

import { renderNameAndEmail } from "../util/util";
import { ChartNotFound } from "../components/ChartNotFound";
import DetailsChartString from "../components/Details/DetailsChartString";
import PpmDetailsPage from "../components/Details/PpmDetails";

const Details = () => {
  const { id, chartSegmentString } = useParams();
  const chartDetailsQuery = useGetChartDetails(chartSegmentString || "");

  const [chartDetails, setSavedChart] = React.useState<AeDetails>({
    isValid: false,
    chartType: "",
    chartString: chartSegmentString ?? "",
    chartStringType: ChartType.PPM,
    errors: [],
    warnings: [],
    segmentDetails: [],
    approvers: [],
    ppmDetails: {
      ppmProjectManager: {
        firstName: null,
        lastName: null,
        email: null,
        name: "",
      },
      ppmGlString: "",
      projectCompletionDate: "",
      projectStartDate: "",
      projectStatus: "",
      projectTypeName: "",
    },
    hasWarnings: false,
  });

  // if we load up new data, update the chart
  useEffect(() => {
    if (chartDetailsQuery.data) {
      const chart = chartDetailsQuery.data;
      setSavedChart(chart);
    }
  }, [chartDetailsQuery.data]);

  const isPpmOrGlClassName =
    chartDetails.chartType === ChartType.PPM ? "is-ppm" : "is-gl";

  const invalid =
    chartDetailsQuery.isLoading ||
    chartDetailsQuery.isFetching ||
    !chartSegmentString ||
    !chartDetails.chartString ||
    chartDetailsQuery.isError ||
    chartDetails.chartType === ChartType.INVALID;

  const renderLoadingOrError = () => {
    if (chartDetailsQuery.isLoading || chartDetailsQuery.isFetching) {
      return (
        <div className={`coa-details is-none`}>
          <FinLoader />
        </div>
      );
    }
    if (chartDetailsQuery.isError) {
      return (
        <div className={`coa-details is-none`}>
          <ChartLoadingError />
        </div>
      );
    }
    if (
      !chartSegmentString ||
      !chartDetails.chartString ||
      chartDetails.chartType === ChartType.INVALID
    ) {
      return (
        <div className={`coa-details is-none`}>
          <ChartNotFound />
        </div>
      );
    }
  };

  return (
    <div className="main">
      <div className="page-title mb-3">
        <h1>{chartDetails.chartType} CoA</h1>
      </div>
      <div className="row display-content-between mb-3">
        <div className="col-6">
          <HomeLink>Back</HomeLink>
        </div>
        {!invalid && (
          <div className="col text-end">
            <Link
              to={`/entry/${
                id
                  ? `${id}/${chartDetails.chartString}`
                  : `${chartDetails.chartString}`
              }`}
            >
              <Button className="btn btn-new me-3">Edit COA</Button>
            </Link>
            <Link to="/share">
              <Button className="btn btn-new">Share COA</Button>
            </Link>
          </div>
        )}
      </div>
      <div>
        {chartDetails.errors.length > 0 &&
          chartDetails.errors.map((error, i) => {
            return (
              <Alert color="danger" key={i}>
                Error: {error}
              </Alert>
            );
          })}
        {chartDetails.hasWarnings &&
          chartDetails.warnings.length > 0 &&
          chartDetails.warnings.map((warning, i) => {
            return (
              <Alert color="warning" key={i}>
                Warning: {warning}
              </Alert>
            );
          })}
      </div>
      {invalid ? (
        renderLoadingOrError()
      ) : (
        <div className={`coa-details ${isPpmOrGlClassName}`}>
          <DetailsChartString
            chartType={chartDetails.chartType}
            chartString={chartDetails.chartString}
            isValid={chartDetails.isValid}
            hasWarnings={chartDetails.hasWarnings}
          />
          <div className="coa-details-info unique-bg">
            {chartDetails.segmentDetails.map((segment, i) => {
              return (
                <div className="row" key={i}>
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
            {chartDetails.chartType === ChartType.PPM && (
              <PpmDetailsPage details={chartDetails.ppmDetails} />
            )}
            <div className="row">
              <div className="col-3">
                <h4>Gl Financial Department SCM Approver(s)</h4>
              </div>
              <div className="col coa-details-info-right">
                {chartDetails.approvers.map((approver, i) => {
                  return (
                    <div key={i}>
                      {renderNameAndEmail(approver.name, approver.email)}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
      <ChartDebugInfo chartDetails={chartDetails} />
    </div>
  );
};

export default Details;
