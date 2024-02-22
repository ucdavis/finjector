import React from "react";
import CopyToClipboardHover from "../Shared/CopyToClipboardHover";
import CopyToClipboardButton from "../Shared/CopyToClipboardButton";
import { Badge } from "reactstrap";
import usePopupStatus from "../../util/customHooks";
import { ChartType, FinQueryStatus } from "../../types";

interface DetailsChartStringProps {
  chartType: string | undefined;
  chartString: string | undefined;
  hasWarnings?: boolean;
  queryStatus: FinQueryStatus;
}

const DetailsChartString: React.FC<DetailsChartStringProps> = ({
  chartType,
  chartString,
  hasWarnings,
  queryStatus: { isLoading, isError },
}) => {
  const isInPopup = usePopupStatus();

  if (isLoading || isError || !chartString) {
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
          <h1>{chartString ?? "0000-00000-0000-00000-0000"}</h1>
        </div>
      </div>
    );
  }

  const isValid = chartType !== ChartType.INVALID; // if we have invalid data
  const badgeColor = isValid ? "success" : "danger";

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
