import React from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import FinLoader from "../components/Shared/FinLoader";

import { AeDetails, ChartStringEditModel, ChartType } from "../types";
import { useGetChartDetails } from "../queries/storedChartQueries";
import { ChartDebugInfo } from "../components/Shared/ChartDebugInfo";
import { ChartLoadingError } from "../components/Shared/ChartLoadingError";
import { Alert } from "reactstrap";
import { renderNameAndEmail } from "../util/util";
import { ChartNotFound } from "../components/Shared/ChartNotFound";
import DetailsChartString from "../components/Details/DetailsChartString";
import PpmDetailsPage from "../components/Details/PpmDetails";
import FinjectorButton from "../components/Shared/FinjectorButton";
import SharePopup from "../components/Shared/SharePopup";
import CopyToClipboardHover from "../components/Shared/CopyToClipboardHover";
import { DetailsRow } from "../components/Details/DetailsRow";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBolt, faPencil } from "@fortawesome/free-solid-svg-icons";
import usePopupStatus from "../util/customHooks";

const Details = () => {
  const { chartId, teamId, folderId, chartSegmentString } = useParams();
  const chartDetailsQuery = useGetChartDetails(
    chartSegmentString || "",
    chartId
  );

  const aeDetails: AeDetails | undefined = chartDetailsQuery.data?.aeDetails;
  const chartStringDetails: ChartStringEditModel | undefined =
    chartDetailsQuery.data?.chartStringDetails;
  const isInPopup = usePopupStatus();
  const navigate = useNavigate();

  const invalid =
    (chartDetailsQuery.isLoading && chartDetailsQuery.isFetching) || // if we're doing first fetch
    chartDetailsQuery.isError || // if we've errored
    !aeDetails?.chartString || // if we have no data
    aeDetails.chartType === ChartType.INVALID; // if we have invalid data

  const getEditLinkUrl = () => {
    if (chartId) {
      return `/teams/${teamId}/folders/${folderId}/entry/${chartId}/${aeDetails?.chartString}`;
    } else {
      return `/entry/${aeDetails?.chartString}`;
    }
  };

  const renderLoadingOrError = () => {
    if (chartDetailsQuery.isLoading && chartDetailsQuery.isFetching) {
      return (
        <div className={`chartstring-details is-none`}>
          <FinLoader />
        </div>
      );
    }
    if (chartDetailsQuery.isError) {
      return (
        <div className={`chartstring-details is-none`}>
          <ChartLoadingError />
        </div>
      );
    }
    if (
      !chartSegmentString ||
      !aeDetails?.chartString ||
      aeDetails.chartType === ChartType.INVALID
    ) {
      return (
        <div className={`chartstring-details is-none`}>
          <ChartNotFound />
        </div>
      );
    }
  };
  const isPpmOrGlClassName =
    aeDetails?.chartType === ChartType.PPM ? "is-ppm" : "is-gl";
  const use = () => {
    if (chartId) {
      navigate(
        `/teams/${teamId}/folders/${folderId}/selected/${chartId}/${aeDetails?.chartString}`
      );
    } else {
      navigate(`/selected/${aeDetails?.chartString}`);
    }
  };

  return (
    <div className="main">
      <div className="page-title pb-2 mb-3 d-flex justify-content-between align-items-center">
        <div>
          {chartStringDetails && (
            <h4>
              {chartStringDetails.teamName} {"/ "}
              {chartStringDetails.folder?.name}
            </h4>
          )}
          <h1>{chartStringDetails?.name ?? "Chart String Details"}</h1>
        </div>
        {!invalid && (
          <div className="col-md-4 text-end">
            {isInPopup && (
              <FinjectorButton onClick={use}>
                <FontAwesomeIcon icon={faBolt} />
                Use
              </FinjectorButton>
            )}
            <Link to={getEditLinkUrl()}>
              <FinjectorButton>
                <FontAwesomeIcon icon={faPencil} />
                Edit Chart String
              </FinjectorButton>
            </Link>
            <SharePopup chartString={aeDetails.chartString} />
          </div>
        )}
      </div>

      {!!aeDetails && (
        <div>
          {aeDetails.errors.length > 0 &&
            aeDetails.errors.map((error, i) => {
              return (
                <Alert color="danger" key={i}>
                  Error: {error}
                </Alert>
              );
            })}
          {!!aeDetails &&
            aeDetails.hasWarnings &&
            aeDetails.warnings.length > 0 &&
            aeDetails.warnings.map((warning, i) => {
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
        <div className={`chartstring-details ${isPpmOrGlClassName}`}>
          <DetailsChartString
            chartType={aeDetails.chartType}
            chartString={aeDetails.chartString}
            isValid={aeDetails.isValid}
            hasWarnings={aeDetails.hasWarnings}
          />
          <div className="chartstring-details-info unique-bg">
            {aeDetails.segmentDetails.map((segment, i) => {
              return (
                <DetailsRow
                  headerColText={segment.entity}
                  key={i}
                  column2={
                    <span className="fw-bold primary-font me-4">
                      <CopyToClipboardHover
                        value={segment.code ?? ""}
                        id={`segment-code-${i}`}
                      >
                        {segment.code ?? ""}{" "}
                      </CopyToClipboardHover>
                    </span>
                  }
                  column3={
                    <CopyToClipboardHover
                      value={segment.name ?? ""}
                      id={`segment-name-${i}`}
                    >
                      {segment?.name ?? ""}
                    </CopyToClipboardHover>
                  }
                />
              );
            })}
          </div>
          <div className="chartstring-details-info">
            {aeDetails.chartType === ChartType.PPM && (
              <PpmDetailsPage details={aeDetails.ppmDetails} />
            )}
            <DetailsRow
              headerColText="GL Financial Department SCM Approver(s)"
              column2={aeDetails.approvers.map((approver, i) => {
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
            />
          </div>
        </div>
      )}
      <ChartDebugInfo chartDetails={chartDetailsQuery.data} />
    </div>
  );
};

export default Details;
