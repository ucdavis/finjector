import React from "react";
import CopyToClipboardHover from "../Shared/CopyToClipboardHover";
import CopyToClipboardButton from "../Shared/CopyToClipboardButton";
import { Badge } from "reactstrap";
import usePopupStatus from "../../util/customHooks";

interface DetailsChartStringProps {
  chartType: string;
  chartString: string;
  isValid: boolean;
  hasWarnings: boolean;
}

const DetailsChartString: React.FC<DetailsChartStringProps> = ({
  chartType,
  chartString,
  isValid,
  hasWarnings,
}) => {
  const isInPopup = usePopupStatus();
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
