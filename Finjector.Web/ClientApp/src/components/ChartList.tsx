import React from "react";
import { Link } from "react-router-dom";

import { Chart } from "../types";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faPaperPlane } from "@fortawesome/free-solid-svg-icons";

interface Props {
  charts: Chart[] | undefined;
}

const ChartList = (props: Props) => {
  const { charts } = props;

  if (!charts) {
    return <div>Loading...</div>;
  }

  return (
    <ul className="list-group">
      {charts.map((chart) => (
        <li
          className="fin-item d-flex justify-content-between align-items-center saved-list-item"
          key={chart.id}
        >
          <div className="col-9 ms-2 me-auto">
            <div className="fw-bold"> {chart.displayName}</div>
            {chart.segmentString}
          </div>
          <div className="col-3">
            <Link
              to={`/entry/${chart.id}/${chart.segmentString}`}
              className="btn btn-link"
            >
              <FontAwesomeIcon icon={faPencil} />
              Edit
            </Link>
            <Link
              to={`/selected/${chart.id}/${chart.segmentString}`}
              className="btn btn-link"
            >
              <FontAwesomeIcon icon={faPaperPlane} />
              Use
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default ChartList;
