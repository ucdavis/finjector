import React from "react";
import { Link } from "react-router-dom";
import { Coa, ChartType, Folder } from "../../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBolt, faScroll } from "@fortawesome/free-solid-svg-icons";
import CopyToClipboardHover from "./CopyToClipboardHover";
import usePopupStatus, { useIsVisible } from "../../util/customHooks";
import ClickableListItem from "./ClickableListItem";
import { useSegmentValidateQuery } from "../../queries/segmentQueries";

import ChartValidationStatus, {
  ChartValidationState,
} from "./ChartValidationStatus";

interface Props {
  chart: Coa;
  folder: Folder;
  showMultiSelect?: boolean;
  isSelected?: boolean;
  onSelectionChange?: (chartId: number, selected: boolean) => void;
}

const ChartListItem = ({
  chart,
  folder,
  showMultiSelect = false,
  isSelected = false,
  onSelectionChange,
}: Props) => {
  const isInPopup = usePopupStatus();
  const { ref, isVisible } = useIsVisible<HTMLLIElement>();

  const destination = isInPopup ? "selected" : "details";
  const url = `/teams/${folder.teamId}/folders/${folder.id}/${destination}/${chart.id}/${chart.segmentString}`;
  const shouldValidate =
    isVisible &&
    chart.segmentString.length > 0 &&
    chart.chartType !== ChartType.INVALID;

  const validationQuery = useSegmentValidateQuery(
    chart.chartType,
    chart.segmentString,
    shouldValidate
  );

  const getValidationStatus = (): ChartValidationState | null => {
    if (!isVisible) return null;

    if (chart.chartType === ChartType.INVALID) {
      return "Invalid";
    }

    if (validationQuery.isLoading || validationQuery.isFetching) {
      return null;
    }

    if (validationQuery.data?.validationResponse.valid === false) {
      return "Invalid";
    }

    if (validationQuery.isError) {
      return "Unknown";
    }

    if (
      validationQuery.data?.validationResponse.valid &&
      validationQuery.data?.warnings &&
      validationQuery.data.warnings.length > 0
    ) {
      return "Warning";
    }

    return validationQuery.data?.validationResponse.valid ? "Valid" : "Unknown";
  };
  const validationStatus = getValidationStatus();

  return (
    <ClickableListItem
      ref={ref}
      className={`chartstring-row ${
        chart.chartType === ChartType.PPM ? "is-ppm" : "is-gl"
      } ${
        showMultiSelect ? "has-selection" : ""
      } d-flex justify-content-between align-items-center`}
      key={chart.id}
      url={url}
    >
      {showMultiSelect && (
        <label
          className={`chartstring-row-select ${
            isSelected ? "is-selected" : ""
          }`}
        >
          <input
            type="checkbox"
            aria-label={`Select ${chart.name || chart.segmentString}`}
            checked={isSelected}
            onChange={(event) =>
              onSelectionChange?.(chart.id, event.target.checked)
            }
          />
        </label>
      )}
      {showMultiSelect && (
        <span className="chartstring-row-color-indicator" aria-hidden="true" />
      )}
      <div className="chartstring-row-main ms-2 me-auto">
        <div className="d-flex flex-wrap align-items-center gap-2">
          <span className="chartstring-type">{chart.chartType}</span>
          {validationStatus && (
            <ChartValidationStatus status={validationStatus} />
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
      <div className="text-end chartstring-row-actions d-flex align-items-center gap-2">
        <Link
          aria-label={`Details for ${chart.name || chart.segmentString}`}
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
            aria-label={`Use ${chart.name || chart.segmentString}`}
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
