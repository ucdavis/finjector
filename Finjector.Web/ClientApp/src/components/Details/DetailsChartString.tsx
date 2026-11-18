import React from "react";
import CopyToClipboardHover from "../Shared/CopyToClipboardHover";
import { Badge } from "reactstrap";
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
        <div className="w-100">
          <div className="chartstring-type" role="status">
            <span>PPM or GL </span>
            <div className="div">
              {isLoading ? (
                <Badge color="secondary" pill={true} className="me-1">
                  Loading...
                </Badge>
              ) : (
                <Badge color="danger" pill={true} className="me-1">
                  Error
                </Badge>
              )}
            </div>
          </div>
          <h2 className="text-break">{chartStringFromUrl ?? "Chart string"}</h2>
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
      <div className="w-100">
        <div className="chartstring-type" role="status">
          <span>{chartType} </span>
          <div className="div">
            {isValid && (
              <Badge color={"success"} pill={true}>
                Valid
              </Badge>
            )}
            {!isValid && (
              <Badge color={"danger"} pill={true}>
                Error
              </Badge>
            )}
            {aeWarnings.length > 0 && (
              <Badge color={"warning"} pill={true} className={"ms-1"}>
                Warning
              </Badge>
            )}
          </div>
        </div>
        <h2 aria-labelledby="chart-string-heading" className="text-break">
          <CopyToClipboardHover value={chartString} id="copyPpmGlString">
            <span id="chart-string-heading">{chartString}</span>
          </CopyToClipboardHover>
        </h2>
      </div>
    </div>
  );
};

export default DetailsChartString;
