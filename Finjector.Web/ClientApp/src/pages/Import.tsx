import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileLines, faFileExport } from "@fortawesome/free-solid-svg-icons";
// import ChartList from "../components/Shared/ChartList";
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
          <h1>Import Team or Folder</h1>
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
      <div className="fin-row saved-list-item">
        <div className="fin-info d-flex justify-content-between align-items-center">
          <div className="col-7 ms-2">
            <h3 className="row-title">Team Name Here</h3>
          </div>
          <div className="col-5 d-flex justify-content-end align-items-center">
            <div className="stat-icon">
              <FontAwesomeIcon
                title="Chart string count in team"
                icon={faFileLines}
              />
              22
            </div>
            <FinjectorButton to={`#`} className="me-1">
              <FontAwesomeIcon icon={faFileExport} />
              Import Team
            </FinjectorButton>
          </div>
        </div>
        <div className="import-folder-row d-flex align-items-center justify-content-between">
          <div className="col-7">
            <h3 className="mb-0">Folder Name Here</h3>
          </div>
          <div className="col-5 d-flex justify-content-end align-items-center">
            <div className="stat-icon">
              <FontAwesomeIcon
                title="Chart string count in folder"
                icon={faFileLines}
              />
              3
            </div>
            <FinjectorButton className="ms-2 btn-borderless" to={`#`}>
              <FontAwesomeIcon icon={faFileExport} />
              Import Folder
            </FinjectorButton>
          </div>
        </div>

        {/* <ChartList teamGroups={savedCharts.data} filter={search} /> */}
      </div>
    </div>
  );
};

export default Landing;
