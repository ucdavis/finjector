import React from "react";
import { Link } from "react-router-dom";

import ChartList from "../components/Shared/ChartList";
import { useGetSavedCharts } from "../queries/storedChartQueries";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPaperclip } from "@fortawesome/free-solid-svg-icons";

// Main landing screen for popup

const Landing = () => {
  const [search, setSearch] = React.useState("");

  const savedCharts = useGetSavedCharts();

  return (
    <div>
      <div className="page-title pb-2 mb-3 d-flex justify-content-between align-items-center">
        <h1>My Chart Strings</h1>
        <div className="col-md-9 text-end">
          <Link to="/entry" className="btn btn-new">
            <FontAwesomeIcon icon={faPlus} />
            New Chart String from Scratch
          </Link>

          <Link to="/paste" className="btn btn-new">
            <FontAwesomeIcon icon={faPaperclip} />
            New Chart String from Paste
          </Link>
        </div>
      </div>
      <div className="mb-3">
        <input
          type="search"
          className="form-control searchbar"
          placeholder="Search my saved chart strings"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <ChartList teamGroups={savedCharts.data} filter={search} />
    </div>
  );
};

export default Landing;
