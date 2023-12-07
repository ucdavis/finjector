import { Link } from "react-router-dom";
import FinLoader from "./FinLoader";

import { ChartType, TeamGroupedCoas } from "../../types";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBolt, faScroll } from "@fortawesome/free-solid-svg-icons";
import { useMemo } from "react";
import CopyToClipboardHover from "./CopyToClipboardHover";

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
                  <li
                    className={`coa-row ${
                      chart.chartType === ChartType.PPM ? "is-ppm" : "is-gl"
                    } d-flex justify-content-between align-items-center saved-list-item`}
                    key={chart.id}
                  >
                    <div className="col-9 ms-2 me-auto">
                      <div className="coa-type">
                        <span>{chart.chartType}</span>
                      </div>
                      <div className="fw-bold "> {chart.name}</div>
                      <span style={{ wordWrap: "break-word" }}>
                        <CopyToClipboardHover
                          value={chart.segmentString}
                          id={`chart-list-${chart.id}`}
                        >
                          {chart.segmentString}
                        </CopyToClipboardHover>
                      </span>
                    </div>
                    <div className="col-3 text-end">
                      <Link
                        to={`/details/${chart.id}/${chart.segmentString}`}
                        className="btn btn-link"
                      >
                        <FontAwesomeIcon icon={faScroll} />
                        Details
                      </Link>
                      <Link
                        to={`/selected/${chart.id}/${chart.segmentString}`}
                        className="btn btn-link"
                      >
                        <FontAwesomeIcon icon={faBolt} />
                        Use
                      </Link>
                    </div>
                  </li>
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
