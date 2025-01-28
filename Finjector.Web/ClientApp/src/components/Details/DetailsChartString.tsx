import React from "react";
import CopyToClipboardHover from "../Shared/CopyToClipboardHover";
import CopyToClipboardButton from "../Shared/CopyToClipboardButton";
import { Badge } from "reactstrap";
import usePopupStatus from "../../util/customHooks";
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
  const isInPopup = usePopupStatus();

  // this handles errors from the query, not errors from AE
  if (isLoading || isError || !aeDetails) {
    return (
      <div className="chartstring-details-title d-flex justify-content-between align-items-center">
        <div className="col-11">
          <div className="chartstring-type">
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
          {/* Don't put the copy to clipboard on hover here, it can cause an error if it is clicked before everything loads */}
          <h1>{chartStringFromUrl ?? "0000-00000-0000-00000-0000"}</h1>
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
      <div className="col-11">
        <div className="chartstring-type">
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
        <CopyToClipboardHover value={chartString} id="copyPpmGlString">
          <h1>{chartString}</h1>
        </CopyToClipboardHover>
      </div>
      {!isInPopup && (
        <div className="col-1">
          <CopyToClipboardButton
            value={chartString}
            id="copyPpmGlStringButton"
            link={true}
          />
        </div>
      )}
    </div>
  );
};

export default DetailsChartString;
