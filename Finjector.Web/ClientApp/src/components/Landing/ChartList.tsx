import { faUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';

import { ChartType, FinQueryStatus, TeamGroupedCoas } from '../../types';
import { useFinQueryStatusHandler } from '../../util/error';
import ChartListItem from '../Shared/ChartListItem';

interface Props {
  teamGroups: TeamGroupedCoas[] | undefined;
  filter: string;
  queryStatus: FinQueryStatus;
}

const ChartList = (props: Props) => {
  const { teamGroups, queryStatus } = props;

  const query = props.filter.toLowerCase();

  const filteredTeamGroups = useMemo(() => {
    if (!teamGroups) return [];

    if (!query) return teamGroups;

    const teamGroupsClone: TeamGroupedCoas[] = JSON.parse(
      JSON.stringify(teamGroups),
    );

    // special case -- if filter includes "GL" or "PPM" then filter out all coas except for the correct types
    const filterByType = query
      .split(' ')
      .find((q) => q === 'gl' || q === 'ppm');

    if (filterByType) {
      const filtered = filterTeamGroupsByType(teamGroupsClone, filterByType);

      // now strip out the "gl" or "ppm" from the query so it doesn't get picked up by the next filter
      const queryWithoutType = query
        .split(' ')
        .filter((q) => q !== filterByType)
        .join(' ');

      // if there isn't anything left in the query, return the filtered list
      if (queryWithoutType) {
        return filterTeamGroupsByQuery(filtered, queryWithoutType);
      } else {
        return filtered;
      }
    }

    // general case - just filter out charts that don't match the search filter
    return filterTeamGroupsByQuery(teamGroupsClone, query);
  }, [teamGroups, query]);

  const queryStatusComponent = useFinQueryStatusHandler({
    queryStatus,
  });
  if (queryStatusComponent) return <>{queryStatusComponent}</>;
  // we don't have to check if the teamGroups is empty, they will always have Personal

  return (
    <div>
      {filteredTeamGroups.map((teamGroup) => (
        <div className='teamlist-wrapper' key={teamGroup.team.id}>
          <h2>
            <Link
              className='no-link-style d-flex vertical-align-top'
              to={`/teams/${teamGroup.team.id}`}
            >
              {teamGroup.team.name}
              <FontAwesomeIcon icon={faUpRightFromSquare} />
            </Link>
          </h2>
          <div
            className='team-chart-wrapper'
            key={`teamid-${teamGroup.team.id}`}
          >
            {teamGroup.folders.map((folder) => (
              <div
                className='folder-chart-wrapper'
                key={`folderid-${folder.id}`}
              >
                <h3>
                  <Link
                    className='no-link-style d-flex vertical-align-top'
                    to={`/teams/${teamGroup.team.id}/folders/${folder.id}`}
                  >
                    {folder.name}
                    <FontAwesomeIcon icon={faUpRightFromSquare} />
                  </Link>
                </h3>
                <ul className='list-group'>
                  {folder.coas.map((chart) => (
                    <ChartListItem
                      key={chart.id}
                      folder={folder}
                      chart={chart}
                    />
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

function filterTeamGroupsByType(
  teamGroupsClone: TeamGroupedCoas[],
  type: string,
): TeamGroupedCoas[] {
  return teamGroupsClone.filter((teamGroup) => {
    // Filter the folders within the team
    teamGroup.folders = teamGroup.folders.filter((folder) => {
      // Filter the charts within the folder
      folder.coas = folder.coas.filter((coa) => {
        // Check if chart name or segmentString matches the query
        return type === 'gl'
          ? coa.chartType === ChartType.GL
          : coa.chartType === ChartType.PPM;
      });

      // Keep the folder if it still has charts after filtering
      return folder.coas.length > 0;
    });

    // Keep the team if it still has folders after filtering
    return teamGroup.folders.length > 0;
  });
}

function filterTeamGroupsByQuery(
  teamGroupsClone: TeamGroupedCoas[],
  query: string,
): TeamGroupedCoas[] {
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
}

export default ChartList;
