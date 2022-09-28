import React from "react";
import ChartList from "../components/ChartList";
import { useGetSavedCharts } from "../queries/storedChartQueries";

// Main landing screen for popup

const Landing = () => {
  // TODO: add a loading state -- for now not needed because localstorage is synchronous
  const savedCharts = useGetSavedCharts();

  return (
    <div>
      <h1>Finjector</h1>
      <div className="mb-3">
        <input
          type="search"
          className="form-control"
          placeholder="Search my saved charts"
        />
      </div>
      <hr />
      <button className="btn btn-primary">Create new chart</button>
      <ChartList charts={savedCharts.data} />
    </div>
  );
};

export default Landing;
