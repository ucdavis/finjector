import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Coa, ChartType, Folder } from "../../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBolt,
  faCheck,
  faScroll,
  faSpinner,
  faInfoCircle,
  faQuestionCircle,
  faTimesCircle,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import CopyToClipboardHover from "./CopyToClipboardHover";
import usePopupStatus from "../../util/customHooks";
import ClickableListItem from "./ClickableListItem";
import { Badge } from "reactstrap";

interface Props {
  chart: Coa;
  folder: Folder;
}

const ChartListItem = ({ chart, folder }: Props) => {
  const isInPopup = usePopupStatus();

  const destination = isInPopup ? "selected" : "details";
  const url = `/teams/${folder.teamId}/folders/${folder.id}/${destination}/${chart.id}/${chart.segmentString}`;

  const validationUrl = `/api/charts/validateChartString?chartString=${chart.segmentString}`;

  // State for chartState
  const [chartState, setChartState] = useState("Undefined");

  const handleMouseEnter = async () => {
    if (chartState === "Undefined") {
      setChartState("Checking");
      try {
        const response = await fetch(validationUrl);

        if (response.status === 200) {
          const data = await response.text();
          // possible values: Unknown, Invalid, Valid, Warning
          setChartState(data); // Assuming the response is a string like "ValidFaked"
        } else {
          setChartState("Unknown");
        }
      } catch {
        setChartState("error");
      }
    }
  };

  return (
    <ClickableListItem
      className={`chartstring-row ${
        chart.chartType === ChartType.PPM ? "is-ppm" : "is-gl"
      } d-flex justify-content-between align-items-center`}
      key={chart.id}
      url={url}
      onMouseEnter={handleMouseEnter}
    >
      <div className="col-9 ms-2 me-auto">
        <div className="chartstring-type">
          <span>{chart.chartType}</span>
          {chartState === "Checking" && (
            <span className="primary-font">
              {" "}
              <FontAwesomeIcon icon={faSpinner} /> Checking...
            </span>
          )}
          {chartState === "Valid" && (
            <span className="listBadge">
              {" "}
              <Badge color={"success"} pill={true}>
                Valid
              </Badge>
            </span>
          )}
          {chartState === "Invalid" && (
            <span className="listBadge">
              {" "}
              <Badge color={"danger"} pill={true}>
                Invalid
              </Badge>
            </span>
          )}
          {chartState === "Warning" && (
            <span className="listBadge">
              {" "}
              <Badge color={"warning"} pill={true} className={"ms-1"}>
                Warning
              </Badge>
            </span>
          )}
          {chartState === "Unknown" && (
            <span className="listBadge">
              {" "}
              <Badge color={"danger"} pill={true}>
                Unknown Validation
              </Badge>
            </span>
          )}
        </div>
        <div className="fw-bold "> {chart.name}</div>
        {!isInPopup && (
          <span style={{ wordWrap: "break-word" }}>
            <CopyToClipboardHover
              value={chart.segmentString}
              id={`chart-list-${chart.id}`}
            >
              {chart.segmentString}
            </CopyToClipboardHover>
          </span>
        )}
        {isInPopup && (
          <span style={{ wordWrap: "break-word" }}>{chart.segmentString}</span>
        )}
      </div>
      <div className="col-3 text-end">
        <Link
          to={`/teams/${folder.teamId}/folders/${folder.id}/details/${chart.id}/${chart.segmentString}`}
          className={`btn btn-link ${
            destination === "details" ? "row-link-selected-action" : ""
          }`}
        >
          <FontAwesomeIcon icon={faScroll} />
          Details
        </Link>
        {isInPopup && (
          <Link
            to={`/teams/${folder.teamId}/folders/${folder.id}/selected/${chart.id}/${chart.segmentString}`}
            className={`btn btn-link ${
              destination === "selected" ? "row-link-selected-action" : ""
            }`}
          >
            <FontAwesomeIcon icon={faBolt} />
            Use
          </Link>
        )}
      </div>
    </ClickableListItem>
  );
};

export default ChartListItem;
