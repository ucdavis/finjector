import React from "react";
import { Alert } from "reactstrap";
import { AeDetails, ChartType } from "../../types";
import { renderNameAndEmail } from "../../util/util";
import CopyToClipboardHover from "../Shared/CopyToClipboardHover";
import DetailsChartString from "./DetailsChartString";
import { DetailsRow } from "./DetailsRow";
import PpmDetailsPage from "./PpmDetails";
import { ChartLoadingError } from "../Shared/LoadingAndErrors/ChartLoadingError";
import { FinError } from "../Shared/LoadingAndErrors/FinError";
import FinLoader from "../Shared/LoadingAndErrors/FinLoader";

interface DetailsBodyProps {
  aeDetails: AeDetails | undefined;
  chartSegmentString: string | undefined;
  invalid: boolean;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
}

const DetailsBody: React.FC<DetailsBodyProps> = ({
  aeDetails,
  chartSegmentString,
  isLoading,
  isFetching,
  isError,
}) => {
  if (isLoading && isFetching) {
    return <FinLoader />;
  }
  if (isError) {
    return <ChartLoadingError />;
  }
  if (
    !chartSegmentString ||
    !aeDetails?.chartString ||
    aeDetails.chartType === ChartType.INVALID
  ) {
    return (
      <FinError
        title="Chart Not Found"
        errorText="Please check that you have a valid chart ID and try again."
      />
    );
  }

  const isPpmOrGlClassName =
    aeDetails?.chartType === ChartType.PPM ? "is-ppm" : "is-gl";
  return (
    <>
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
    </>
  );
};

export default DetailsBody;
