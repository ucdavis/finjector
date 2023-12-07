import { useMemo } from "react";
import FinLoader from "./FinLoader";
import { TeamGroupedCoas } from "../../types";
import ChartListItem from "./ChartListItem";

interface Props {
  teamGroups: TeamGroupedCoas[] | undefined;
  filter: string;
}

const ChartList = (props: Props) => {
  const { teamGroups } = props;

  const query = props.filter.toLowerCase();

  const filteredTeamGroups = useMemo(() => {
    if (!teamGroups) return [];

    if (!query) return teamGroups;

    const teamGroupsClone: TeamGroupedCoas[] = JSON.parse(
      JSON.stringify(teamGroups)
    );

    // filter out charts that don't match the search filter
    return teamGroupsClone.filter((teamGroup) => {
      // Check if team name matches the query
      if (teamGroup.team.name.toLowerCase().includes(query)) return true;

      // Filter the folders within the team
      teamGroup.folders = teamGroup.folders.filter((folder) => {
        // Check if folder name matches the query
        if (folder.name.toLowerCase().includes(query)) return true;

        // Filter the charts within the folder
        folder.coas = folder.coas.filter((coa) => {
          // Check if chart name or segmentString matches the query
          return (
            coa.name.toLowerCase().includes(query) ||
            coa.segmentString.toLowerCase().includes(query)
          );
        });

        // Keep the folder if it still has charts after filtering
        return folder.coas.length > 0;
      });

      // Keep the team if it still has folders after filtering
      return teamGroup.folders.length > 0;
    });
  }, [teamGroups, query]);

  if (!teamGroups) {
    return <FinLoader />;
  }

  return (
    <div>
      {filteredTeamGroups.map((teamGroup) => (
        <div className="team-chart-wrapper" key={teamGroup.team.id}>
          <h2>{teamGroup.team.name}</h2>
          {teamGroup.folders.map((folder) => (
            <div key={folder.id}>
              <h3>{folder.name}</h3>
              <ul className="list-group">
                {folder.coas.map((chart) => (
                  <ChartListItem key={chart.id} chart={chart} />
                ))}
              </ul>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ChartList;
