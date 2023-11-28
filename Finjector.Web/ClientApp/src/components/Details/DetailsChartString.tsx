import React from "react";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CopyToClipboardHover from "../../shared/CopyToClipboardHover";
import CopyToClipboard from "../../shared/CopyToClipboard";
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
          <span>
            {chartType}{" "}
            <Badge color={badgeColor} pill={true}>
              {isValid ? "Valid" : hasWarnings ? "Warning" : "Error"}
            </Badge>
          </span>
        </div>
        <CopyToClipboardHover value={chartString} id="copyPpmGlString">
          <h1>{chartString}</h1>
        </CopyToClipboardHover>
      </div>
      <div className="col-1">
        <CopyToClipboard value={chartString} id="copyPpmGlStringButton">
          <div className="btn btn-link">
            <FontAwesomeIcon icon={faCopy} />
            Copy
          </div>
        </CopyToClipboard>
      </div>
    </div>
  );
};

export default DetailsChartString;
