import React from "react";
import { AeDetails, ChartType, FinQueryStatus } from "../../types";
import { renderNameAndEmail } from "../../util/util";
import CopyToClipboardHover from "../Shared/CopyToClipboardHover";
import { DetailsRow } from "./DetailsRow";
import PpmDetailsPage from "./PpmDetails";
import { FinError } from "../Shared/LoadingAndErrors/FinError";
import { useFinQueryStatusHandler } from "../../util/error";
import { ChartLoadingError } from "../Shared/LoadingAndErrors/ChartLoadingError";

interface DetailsBodyProps {
  aeDetails: AeDetails | undefined;
  chartSegmentString: string | undefined;
  queryStatus: FinQueryStatus;
}

const DetailsTable: React.FC<DetailsBodyProps> = ({
  aeDetails,
  chartSegmentString,
  queryStatus,
}) => {
  const queryStatusComponent = useFinQueryStatusHandler({
    queryStatus,
    DefaultError: <ChartLoadingError />,
  });

  if (queryStatusComponent)
    return (
      <div className="chartstring-details-info">{queryStatusComponent}</div>
    );

  if (
    // invalid chart id but no error in fetch
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

  const renderSegmentHeader = (segment: AeDetails["segmentDetails"][number]) => {
    const showFundBadges =
      (aeDetails.chartType === ChartType.GL && segment.entity === "Fund") ||
      (aeDetails.chartType === ChartType.PPM &&
        segment.entity === "GL Posting Fund");

    if (!showFundBadges || (!segment.giftFund && !segment.endowmentGiftFund)) {
      return segment.entity;
    }

    return (
      <span className="d-inline-flex align-items-center gap-2 flex-wrap">
        <span>{segment.entity}</span>
        {segment.giftFund && <span className="badge bg-primary">Gift</span>}
        {segment.endowmentGiftFund && (
          <span className="badge bg-secondary">Endowment</span>
        )}
      </span>
    );
  };

  return (
    <>
      <div className="chartstring-details-info unique-bg">
        {aeDetails.segmentDetails.map((segment, i) => {
          return (
            <DetailsRow
              headerColText={renderSegmentHeader(segment)}
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
        {aeDetails.fundPurpose && (
          <DetailsRow
            headerColText="Fund Purpose"
            column2={
              <CopyToClipboardHover
                value={aeDetails.fundPurpose}
                id="fundPurpose"
              >
                {aeDetails.fundPurpose}
              </CopyToClipboardHover>
            }
          />
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
