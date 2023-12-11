import { Link } from "react-router-dom";
import { Coa, ChartType } from "../../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBolt, faScroll } from "@fortawesome/free-solid-svg-icons";
import CopyToClipboardHover from "./CopyToClipboardHover";
import usePopupStatus from "../../util/customHooks";

interface Props {
  chart: Coa;
}

const ChartListItem = ({ chart }: Props) => {
  const isInPopup = usePopupStatus();

  const destination = isInPopup ? "/selected" : "/details";

  return (
    <Link
      className="chartstring-link"
      to={`${destination}/${chart.id}/${chart.segmentString}`}
    >
      <li
        className={`chartstring-row ${
          chart.chartType === ChartType.PPM ? "is-ppm" : "is-gl"
        } d-flex justify-content-between align-items-center saved-list-item`}
        key={chart.id}
      >
        <div className="col-9 ms-2 me-auto">
          <div className="chartstring-type">
            <span>{chart.chartType}</span>
          </div>
          <div className="fw-bold "> {chart.name}</div>
          <span style={{ wordWrap: "break-word" }}>
            <CopyToClipboardHover
              value={chart.segmentString}
              id={`chart-list-${chart.id}`}
            >
              {chart.segmentString}
            </CopyToClipboardHover>
          </span>
        </div>
        <div className="col-3 text-end">
          <Link
            to={`/details/${chart.id}/${chart.segmentString}`}
            className="btn btn-link"
          >
            <FontAwesomeIcon icon={faScroll} />
            Details
          </Link>
          <Link
            to={`/selected/${chart.id}/${chart.segmentString}`}
            className="btn btn-link"
          >
            <FontAwesomeIcon icon={faBolt} />
            Use
          </Link>
        </div>
      </li>
    </Link>
  );
};

export default ChartListItem;
