import React from "react";
import { Link } from "react-router-dom";

import ChartList from "../components/ChartList";
import { useGetSavedCharts } from "../queries/storedChartQueries";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPaste } from "@fortawesome/free-solid-svg-icons";

// Main landing screen for popup

const Landing = () => {
  const [search, setSearch] = React.useState("");

  const savedCharts = useGetSavedCharts();

  return (
    <div>
      <div className="page-title mb-3">
        <h1>My Charts</h1>
      </div>
      <div className="mb-3">
        <input
          type="search"
          className="form-control searchbar"
          placeholder="Search my saved charts"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="row justify-content-between">
        <div className="d-grid gap-2 d-md-block">
          <Link to="/entry" className="btn btn-new me-3">
            <FontAwesomeIcon icon={faPlus} />
            New CoA from Scratch
          </Link>

          <Link to="/paste" className="btn btn-new">
            <FontAwesomeIcon icon={faPaste} />
            New CoA from Paste
          </Link>
        </div>
      </div>

      <ChartList charts={savedCharts.data} filter={search} />
    </div>
  );
};

export default Landing;
