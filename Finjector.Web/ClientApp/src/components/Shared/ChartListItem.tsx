import { Link, useNavigate } from "react-router-dom";
import { Coa, ChartType, Folder } from "../../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBolt, faScroll } from "@fortawesome/free-solid-svg-icons";
import CopyToClipboardHover from "./CopyToClipboardHover";
import usePopupStatus from "../../util/customHooks";
import ClickableListItem from "./ClickableListItem";

interface Props {
  chart: Coa;
  folder: Folder;
}

const ChartListItem = ({ chart, folder }: Props) => {
  const isInPopup = usePopupStatus();
  const navigate = useNavigate();

  // TODO: replace with breadcrumb changes
  const destination = isInPopup ? "/selected" : "/details";
  const url = `${destination}/${chart.id}/${chart.segmentString}`;

  const onChartClick = (e: any) => {
    // don't navigate if the user was just selecting text
    const selection = window.getSelection();

    if (selection && selection.toString()) return;

    // we don't want to navigate if they clicked a link or icon button
    const tagName = e?.target.tagName.toLowerCase();

    const isActionTag =
      tagName === "a" || tagName === "svg" || tagName === "path";

    if (!isActionTag) {
      const destination = isInPopup ? "selected" : "details";
      navigate(
        `/teams/${folder.teamId}/folders/${folder.id}/${destination}/${chart.id}/${chart.segmentString}`
      );
    }
  };

  return (
    <ClickableListItem
      className={`chartstring-row ${
        chart.chartType === ChartType.PPM ? "is-ppm" : "is-gl"
      } d-flex justify-content-between align-items-center`}
      key={chart.id}
      url={url}
    >
      <div className="col-9 ms-2 me-auto">
        <div className="chartstring-type">
          <span>{chart.chartType}</span>
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
            destination === "/details" ? "row-link-selected-action" : ""
          }`}
        >
          <FontAwesomeIcon icon={faScroll} />
          Details
        </Link>
        <Link
          to={`/teams/${folder.teamId}/folders/${folder.id}/selected/${chart.id}/${chart.segmentString}`}
          className={`btn btn-link ${
            destination === "/selected" ? "row-link-selected-action" : ""
          }`}
        >
          <FontAwesomeIcon icon={faBolt} />
          Use
        </Link>
      </div>
    </ClickableListItem>
  );
};

export default ChartListItem;
