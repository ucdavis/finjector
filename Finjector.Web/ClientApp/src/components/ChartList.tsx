import React from "react";
import { Link } from "react-router-dom";
import FinLoader from "./FinLoader";

import { Coa } from "../types";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faPaperPlane } from "@fortawesome/free-solid-svg-icons";

interface Props {
  charts: Coa[] | undefined;
  filter: string;
}

const ChartList = (props: Props) => {
  const { charts } = props;

  if (!charts) {
    return <FinLoader />;
  }

  const filterLowercase = props.filter.toLowerCase();

  const filteredCharts = charts.filter((chart) => {
    return (
      chart.name.toLowerCase().includes(filterLowercase) ||
      chart.segmentString.toLowerCase().includes(filterLowercase)
    );
  });

  return (
    <ul className="list-group">
      {filteredCharts.map((chart) => (
        <li
          className="fin-item d-flex justify-content-between align-items-center saved-list-item"
          key={chart.id}
        >
          <div className="col-9 ms-2 me-auto">
            <div className="fw-bold "> {chart.name}</div>
            <span style={{ wordWrap: "break-word" }}>
              {chart.segmentString}
            </span>
          </div>
          <div className="col-3">
            <Link
              to={`/details/${chart.id}/${chart.segmentString}`}
              className="btn btn-link"
            >
              <FontAwesomeIcon icon={faPencil} />
              Details
            </Link>
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
