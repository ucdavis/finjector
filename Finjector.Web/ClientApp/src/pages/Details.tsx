import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import FinLoader from "../components/Shared/FinLoader";

import { ChartType } from "../types";
import { useGetChartDetails } from "../queries/storedChartQueries";
import { ChartDebugInfo } from "../components/Shared/ChartDebugInfo";
import { ChartLoadingError } from "../components/Shared/ChartLoadingError";
import { Alert } from "reactstrap";
import { renderNameAndEmail } from "../util/util";
import { ChartNotFound } from "../components/Shared/ChartNotFound";
import DetailsChartString from "../components/Details/DetailsChartString";
import PpmDetailsPage from "../components/Details/PpmDetails";
import { BackLinkBar } from "../components/Shared/BackLinkBar";
import FinjectorButton from "../components/Shared/FinjectorButton";
import SharePopup from "../components/Shared/SharePopup";
import CopyToClipboardHover from "../shared/CopyToClipboardHover";
import { DetailsRow } from "../components/Details/DetailsRow";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";

const Details = () => {
  const { id, chartSegmentString } = useParams();
  const chartDetailsQuery = useGetChartDetails(chartSegmentString || "");

  const chartDetails = chartDetailsQuery.data;

  const invalid =
    (chartDetailsQuery.isLoading && chartDetailsQuery.isFetching) || // if we're doing first fetch
    chartDetailsQuery.isError || // if we've errored
    !chartDetails?.chartString || // if we have no data
    chartDetails.chartType === ChartType.INVALID; // if we have invalid data

  const renderLoadingOrError = () => {
    if (chartDetailsQuery.isLoading && chartDetailsQuery.isFetching) {
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
      !chartDetails?.chartString ||
      chartDetails.chartType === ChartType.INVALID
    ) {
      return (
        <div className={`coa-details is-none`}>
          <ChartNotFound />
        </div>
      );
    }
  };
  const isPpmOrGlClassName =
    chartDetails?.chartType === ChartType.PPM ? "is-ppm" : "is-gl";

  return (
    <div className="main">
      <div className="page-title mb-3">
        <h1>{chartDetails?.chartType} CoA</h1>
      </div>
      <div className="row display-content-between mb-3">
        <div className="col-6">
          <BackLinkBar />
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
              <FinjectorButton>
                <FontAwesomeIcon icon={faPencil} />
                Edit COA
              </FinjectorButton>
            </Link>
            <SharePopup chartString={chartDetails.chartString} teamId={id} />
          </div>
        )}
      </div>
      {!!chartDetails && (
        <div>
          {chartDetails.errors.length > 0 &&
            chartDetails.errors.map((error, i) => {
              return (
                <Alert color="danger" key={i}>
                  Error: {error}
                </Alert>
              );
            })}
          {!!chartDetails &&
            chartDetails.hasWarnings &&
            chartDetails.warnings.length > 0 &&
            chartDetails.warnings.map((warning, i) => {
              return (
                <Alert color="warning" key={i}>
                  Warning: {warning}
                </Alert>
              );
            })}
        </div>
      )}
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
                <DetailsRow header={segment.entity} key={i}>
                  <span className="fw-bold primary-font me-3">
                    <CopyToClipboardHover
                      value={segment.code ?? ""}
                      id={`segment-code-${i}`}
                    >
                      {segment.code}{" "}
                    </CopyToClipboardHover>
                  </span>
                  <CopyToClipboardHover
                    value={segment.name ?? ""}
                    id={`segment-name-${i}`}
                  >
                    {segment.name}{" "}
                  </CopyToClipboardHover>
                </DetailsRow>
              );
            })}
          </div>
          <div className="coa-details-info">
            {chartDetails.chartType === ChartType.PPM && (
              <PpmDetailsPage details={chartDetails.ppmDetails} />
            )}
            <DetailsRow header="GL Financial Department SCM Approver(s)">
              {chartDetails.approvers.map((approver, i) => {
                return (
                  <div key={i}>
                    <CopyToClipboardHover
                      value={approver.email ?? ""}
                      id={`approver-${i}`}
                    >
                      {renderNameAndEmail(approver.name, approver.email)}
                    </CopyToClipboardHover>
                  </div>
                );
              })}
            </DetailsRow>
          </div>
        </div>
      )}
      <ChartDebugInfo chartDetails={chartDetails} />
    </div>
  );
};

export default Details;
