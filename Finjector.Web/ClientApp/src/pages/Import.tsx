import React, { useMemo } from "react";
import { useGetSavedCharts } from "../queries/storedChartQueries";
import ImportListTeamRow from "../components/Import/ImportListTeamRow";
import { TeamGroupedCoas } from "../types";

// Main landing screen for popup

const Import = () => {
  const [search, setSearch] = React.useState("");

  const teamGroupsQuery = useGetSavedCharts();

  const teamGroups = teamGroupsQuery.data;

  const filteredTeamGroups = useMemo(() => {
    if (!teamGroups) return [];

    if (!search) return teamGroups;

    const searchLower = search.toLowerCase();

    const teamGroupsClone: TeamGroupedCoas[] = JSON.parse(
      JSON.stringify(teamGroups)
    );

    // filter out charts that don't match the search filter
    return teamGroupsClone.filter((teamGroup) => {
      // Check if team name matches the query
      if (teamGroup.team.name.toLowerCase().includes(searchLower)) return true;

      // Filter the folders within the team
      teamGroup.folders = teamGroup.folders.filter((folder) => {
        // Check if folder name matches the query
        return folder.name.toLowerCase().includes(searchLower);
      });

      // Keep the team if it still has folders after filtering
      return teamGroup.folders.length > 0;
    });
  }, [teamGroups, search]);

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
          placeholder="Search Teams or Folders to import"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <ul className="list-group">
        {filteredTeamGroups?.map((teamGroup) => {
          return (
            <ImportListTeamRow key={teamGroup.team.id} teamGroup={teamGroup} />
          );
        })}
      </ul>
    </div>
  );
};

export default Import;
