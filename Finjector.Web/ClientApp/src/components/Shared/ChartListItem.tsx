import { Link } from "react-router-dom";
import { Coa, ChartType, Folder } from "../../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBan,
  faBolt,
  faCheck,
  faScroll,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import CopyToClipboardHover from "./CopyToClipboardHover";
import usePopupStatus, { useIsVisible } from "../../util/customHooks";
import ClickableListItem from "./ClickableListItem";
import { useSegmentValidateQuery } from "../../queries/segmentQueries";

interface Props {
  chart: Coa;
  folder: Folder;
}

const ChartListItem = ({ chart, folder }: Props) => {
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

  const getValidationStatus = () => {
    if (!isVisible) return null;

    if (chart.chartType === ChartType.INVALID) {
      return (
        <FontAwesomeIcon
          icon={faBan}
          className="chartstring-validation-icon"
          title="Invalid"
        />
      );
    }

    if (validationQuery.isLoading || validationQuery.isFetching) {
      return null;
    }

    if (
      validationQuery.isError ||
      validationQuery.data?.validationResponse.valid === false
    ) {
      return (
        <FontAwesomeIcon
          icon={faBan}
          className="chartstring-validation-icon"
          title="Invalid"
        />
      );
    }

    if (
      validationQuery.data?.validationResponse.valid &&
      validationQuery.data?.warnings &&
      validationQuery.data.warnings.length > 0
    ) {
      return (
        <FontAwesomeIcon
          icon={faTriangleExclamation}
          className="chartstring-validation-icon"
          title="Warning"
        />
      );
    }

    if (validationQuery.data?.validationResponse.valid) {
      return (
        <FontAwesomeIcon
          icon={faCheck}
          className="chartstring-validation-icon"
          title="Valid"
        />
      );
    }

    return null;
  };

  return (
    <ClickableListItem
      ref={ref}
      className={`chartstring-row ${
        chart.chartType === ChartType.PPM ? "is-ppm" : "is-gl"
      } d-flex justify-content-between align-items-center`}
      key={chart.id}
      url={url}
    >
      <div className="col-9 ms-2 me-auto">
        <div className="chartstring-type">
          <span>{chart.chartType}</span>
          {getValidationStatus()}
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
      <div className="col-3 text-end chartstring-row-actions">
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
