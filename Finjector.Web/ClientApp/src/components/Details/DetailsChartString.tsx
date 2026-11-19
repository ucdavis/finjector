import React from "react";
import CopyToClipboardHover from "../Shared/CopyToClipboardHover";
import ChartValidationStatus from "../Shared/ChartValidationStatus";
import { AeDetails, ChartType, FinQueryStatus } from "../../types";

interface DetailsChartStringProps {
  chartStringFromUrl: string | undefined;
  aeDetails: AeDetails | undefined; // passing in entire obj so we can check once if it's undef
  queryStatus: FinQueryStatus;
}

const DetailsChartString: React.FC<DetailsChartStringProps> = ({
  chartStringFromUrl,
  aeDetails,
  queryStatus: { isLoading, isError },
}) => {
  // this handles errors from the query, not errors from AE
  if (isLoading || isError || !aeDetails) {
    return (
      <div className="chartstring-details-title d-flex justify-content-between align-items-center">
        <div className="text-break">
          <div className="chartstring-type">PPM or GL</div>
          <h2 className="text-break mb-0">
            {chartStringFromUrl ?? "Chart string"}
          </h2>
        </div>
        <div
          className="chartstring-type d-flex align-items-center gap-2 flex-shrink-0 text-end ms-3"
          role="status"
        >
          <ChartValidationStatus
            status={isLoading ? "Loading..." : "Unknown"}
          />
        </div>
      </div>
    );
  }

  const {
    chartString,
    chartType,
    warnings: aeWarnings,
    errors: aeErrors,
  } = aeDetails;
  // our query was successful, but we can still have AE errors. will either be valid or invalid, but can have warnings in either case
  const isValid = aeErrors.length === 0 && chartType !== ChartType.INVALID;

  return (
    <div className="chartstring-details-title d-flex justify-content-between align-items-center">
      <div className="text-break">
        <div className="chartstring-type">{chartType}</div>
        <h2 aria-labelledby="chart-string-heading" className="text-break mb-0">
          <CopyToClipboardHover value={chartString} id="copyPpmGlString">
            <span id="chart-string-heading">{chartString}</span>
          </CopyToClipboardHover>
        </h2>
      </div>
      <div
        className="chartstring-type d-flex align-items-center gap-2 flex-shrink-0 text-end ms-3"
        role="status"
      >
        <ChartValidationStatus status={isValid ? "Valid" : "Invalid"} />
        {aeWarnings.length > 0 && <ChartValidationStatus status="Warning" />}
      </div>
    </div>
  );
};

export default DetailsChartString;
