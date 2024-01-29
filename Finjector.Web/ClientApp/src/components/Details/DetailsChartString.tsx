import React from "react";
import CopyToClipboardHover from "../Shared/CopyToClipboardHover";
import CopyToClipboardButton from "../Shared/CopyToClipboardButton";
import { Badge } from "reactstrap";
import usePopupStatus from "../../util/customHooks";
import { ChartType, FinQueryStatus } from "../../types";

interface DetailsChartStringProps {
  chartType: string | undefined;
  chartString: string | undefined;
  hasWarnings: boolean | undefined;
  queryStatus: FinQueryStatus;
}

const DetailsChartString: React.FC<DetailsChartStringProps> = ({
  chartType,
  chartString,
  hasWarnings,
  queryStatus: { isLoading, isError },
}) => {
  const isInPopup = usePopupStatus();

  const isValid =
    isLoading || // if we're doing first fetch
    isError || // if we've errored
    chartString || // if we have no data
    chartType === ChartType.INVALID; // if we have invalid data
  const badgeColor = isValid ? "success" : "danger";

  if (!chartString) {
    return null;
  }
  return (
    <div className="chartstring-details-title d-flex justify-content-between align-items-center">
      <div className="col-11">
        <div className="chartstring-type">
          <span>{chartType} </span>
          <div className="div">
            <Badge color={badgeColor} pill={true} className="me-1">
              {isValid ? "Valid" : "Error"}
            </Badge>
            {hasWarnings && (
              <Badge color={"warning"} pill={true}>
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
