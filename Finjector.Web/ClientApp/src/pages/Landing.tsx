import React from "react";
import { Link } from "react-router-dom";

import ChartList from "../components/ChartList";
import { useGetSavedCharts } from "../queries/storedChartQueries";

// Main landing screen for popup

const Landing = () => {
  // TODO: add a loading state -- for now not needed because localstorage is synchronous
  const savedCharts = useGetSavedCharts();

  return (
    <div>
      <div className="mb-3">
        <input
          type="search"
          className="form-control"
          placeholder="Search my saved charts"
        />
      </div>
      <hr />
      <div className="row justify-content-between">
        <div className="d-grid gap-2">
          <Link to="/entry" className="btn btn-primary">
            Create new chart from scratch
          </Link>

          <Link to="/paste" className="btn btn-primary">
            Create new chart from paste
          </Link>
        </div>
      </div>

      <ChartList charts={savedCharts.data} />
    </div>
  );
};

export default Landing;
