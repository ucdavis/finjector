import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPaperclip } from "@fortawesome/free-solid-svg-icons";
import ChartList from "../components/Shared/ChartList";
import { useGetSavedCharts } from "../queries/storedChartQueries";
import FinjectorButton from "../components/Shared/FinjectorButton";

// Main landing screen for popup

const Landing = () => {
  const [search, setSearch] = React.useState("");

  const savedCharts = useGetSavedCharts();

  return (
    <div>
      <div className="page-title pb-2 mb-3 row justify-content-between align-items-center">
        <div className="col-12 col-md-4">
          <h1>My Chart Strings</h1>
        </div>

        <div className="col-12 col-md-8 text-end">
          <FinjectorButton to="/entry">
            <FontAwesomeIcon icon={faPlus} />
            New Chart String from Scratch
          </FinjectorButton>

          <FinjectorButton to="/paste">
            <FontAwesomeIcon icon={faPaperclip} />
            New Chart String from Paste
          </FinjectorButton>
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
