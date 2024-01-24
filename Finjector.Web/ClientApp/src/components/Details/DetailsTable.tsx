import React from "react";
import { AeDetails, ChartType } from "../../types";
import { renderNameAndEmail } from "../../util/util";
import CopyToClipboardHover from "../Shared/CopyToClipboardHover";
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

const DetailsTable: React.FC<DetailsBodyProps> = ({
  aeDetails,
  chartSegmentString,
  isLoading,
  isFetching,
  isError,
}) => {
  if (isLoading && isFetching) {
    return (
      <div className="chartstring-details-info unique-bg">
        <FinLoader />
      </div>
    );
  }
  if (isError) {
    return (
      <div className="chartstring-details-info">
        <ChartLoadingError />
      </div>
    );
  }
  if (
    // not entirely sure when this happens and if it is different than isError
    !chartSegmentString ||
    !aeDetails?.chartString ||
    aeDetails.chartType === ChartType.INVALID
  ) {
    return (
      <div className="chartstring-details-info">
        <FinError
          title="Chart Not Found"
          errorText="Please check that you have a valid chart ID and try again."
        />
      </div>
    );
  }

  return (
    <>
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
    </>
  );
};

export default DetailsTable;