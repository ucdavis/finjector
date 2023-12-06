import React from "react";
import CopyToClipboardHover from "../Shared/CopyToClipboardHover";
import CopyToClipboardButton from "../Shared/CopyToClipboardButton";
import { Badge } from "reactstrap";

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
  const badgeColor = isValid
    ? !hasWarnings
      ? "success"
      : "warning"
    : "danger";
  return (
    <div className="coa-details-title d-flex justify-content-between align-items-center">
      <div className="col-11">
        <div className="coa-type">
          <span>{chartType} </span>
          <div className="div">
            <Badge color={badgeColor} pill={true}>
              {isValid ? "Valid" : hasWarnings ? "Warning" : "Error"}
            </Badge>
          </div>
        </div>
        <CopyToClipboardHover value={chartString} id="copyPpmGlString">
          <h1>{chartString}</h1>
        </CopyToClipboardHover>
      </div>
      <div className="col-1">
        <CopyToClipboardButton
          value={chartString}
          id="copyPpmGlStringButton"
          link={true}
        />
      </div>
    </div>
  );
};

export default DetailsChartString;
