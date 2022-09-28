import React from "react";
import { Link } from "react-router-dom";

import { Chart } from "../types";

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
          className="list-group-item d-flex justify-content-between align-items-center"
          key={chart.segmentString}
        >
          <div className="ms-2 me-auto">
            <div className="fw-bold"> {chart.displayName}</div>
            Content for list item
          </div>
          <div>
            <Link
              to={`/entry/${chart.segmentString}`}
              className="btn btn-primary ms-2"
            >
              Edit
            </Link>
            <Link
              to={`/select/${chart.segmentString}`}
              className="btn btn-primary ms-2"
            >
              Use
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default ChartList;
