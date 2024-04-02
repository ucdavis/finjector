import React from "react";
import { Coa, TeamGroupedCoas } from "../types";
import { useGetSavedCharts } from "../queries/storedChartQueries";
import usePopupStatus from "../util/customHooks";
import ImportListTeamRow from "../components/Import/ImportListTeamRow";
import { SearchBar } from "../components/Shared/SearchBar";
import PageTitle from "../components/Shared/Layout/PageTitle";
import PageBody from "../components/Shared/Layout/PageBody";
import FinLoader from "../components/Shared/LoadingAndErrors/FinLoader";

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

  if (teamGroupsQuery.isLoading) {
    return (
      <div>
        <FinLoader />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <p>Please wait... We're testing your patience.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageTitle title="Import Team or Folder" />
      <PageBody>
        <SearchBar
          search={search}
          setSearch={setSearch}
          placeholderText="Search Teams or Folders to import"
        />
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
      </PageBody>
    </div>
  );
};

export default Import;
