import React from "react";
import { useGetSavedCharts } from "../queries/storedChartQueries";
import ImportListTeamRow from "../components/Import/ImportListTeamRow";

// Main landing screen for popup

const Import = () => {
  const [search, setSearch] = React.useState("");

  const teamGroups = useGetSavedCharts();

  const filterLowercase = search.toLowerCase();
  const filteredTeamsInfo = teamGroups.data?.filter((teamInfo) => {
    return teamInfo.team.name.toLowerCase().includes(filterLowercase);
  });

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
          placeholder="Search Teams and Folders to import"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <ul className="list-group">
        {filteredTeamsInfo?.map((teamGroup) => {
          return (
            <ImportListTeamRow key={teamGroup.team.id} teamGroup={teamGroup} />
          );
        })}
      </ul>
    </div>
  );
};

export default Import;
