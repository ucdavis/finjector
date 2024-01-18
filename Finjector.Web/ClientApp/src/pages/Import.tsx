import React from "react";
import { useGetSavedCharts } from "../queries/storedChartQueries";
import ImportListTeamRow from "../components/Import/ImportListTeamRow";
import { Coa, TeamGroupedCoas } from "../types";
import usePopupStatus from "../util/customHooks";

// Main landing screen for popup

const Import = () => {
  const [search, setSearch] = React.useState("");

  const isPopup = usePopupStatus();

  const teamGroupsQuery = useGetSavedCharts();

  const teamGroups = teamGroupsQuery.data;

  const filteredTeamGroups = React.useMemo(() => {
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

  const onImport = React.useCallback((chartStrings: Coa[]) => {
    // get only the name and chart strings from each chart
    const importData = chartStrings.map((chart) => ({
      name: chart.name,
      chartString: chart.segmentString,
    }));

    if (window.opener) {
      window.opener.postMessage(
        {
          source: "finjector",
          operation: "bulk-import",
          status: "success",
          data: importData,
        },
        "*" // send to all, we don't know the origin
      );
      // message sent, close the window
      window.close();
    }
  }, []);

  if (!isPopup) {
    return (
      <div>
        <p>Import is only intended for use in a popup window.</p>
        <a href="/">Back to homepage</a>
      </div>
    );
  }

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
            <ImportListTeamRow
              key={teamGroup.team.id}
              teamGroup={teamGroup}
              onImport={onImport}
            />
          );
        })}
      </ul>
    </div>
  );
};

export default Import;
