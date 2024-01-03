import React from "react";

import FinLoader from "../Shared/FinLoader";

import { TeamsResponseModel } from "../../types";
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolder,
  faUsers,
  faSitemap,
  faMagnifyingGlassChart,
  faFileLines,
  faNoteSticky,
  faStickyNote,
} from "@fortawesome/free-solid-svg-icons";
import ClickableListItem from "../Shared/ClickableListItem";

interface Props {
  teamsInfo: TeamsResponseModel[] | undefined;
  filter: string;
}

const ChartList = (props: Props) => {
  const { teamsInfo } = props;

  if (!teamsInfo) {
    return <FinLoader />;
  }

  const filterLowercase = props.filter.toLowerCase();

  const filteredTeamsInfo = teamsInfo.filter((teamInfo) => {
    return teamInfo.team.name.toLowerCase().includes(filterLowercase);
  });

  return (
    <ul className="list-group">
      {filteredTeamsInfo.map((teamInfo) => {
        const url = `/teams/${teamInfo.team.id}`;
        return (
          <ClickableListItem
            className="fin-row saved-list-item"
            key={teamInfo.team.id}
            url={url}
          >
            <div className="fin-info d-flex justify-content-between align-items-center">
              <div className="col-9 ms-2 me-auto">
                <h3 className="row-title">{teamInfo.team.name}</h3>
                <p className="row-subtitle">
                  <span style={{ wordWrap: "break-word" }}>
                    {teamInfo.team.description}
                  </span>
                </p>
              </div>
              <div className="col-3 d-flex justify-content-end">
                <div className="stat-icon">
                  <FontAwesomeIcon
                    title="Folder count in team"
                    icon={faFolder}
                  />
                  {teamInfo.folderCount}{" "}
                </div>
                <div className="stat-icon">
                  <FontAwesomeIcon title="User count in team" icon={faUsers} />
                  {teamInfo.uniqueUserPermissionCount}
                </div>
                <div className="stat-icon">
                  <FontAwesomeIcon
                    title="Chart string count in team"
                    icon={faMagnifyingGlassChart}
                  />

                  {teamInfo.chartCount}
                </div>
              </div>
            </div>
            <div className="fin-actions">
              <Link
                className="bold-link me-3 row-link-selected-action"
                to={url}
              >
                <FontAwesomeIcon icon={faSitemap} />
                Go to Team
              </Link>
            </div>
          </ClickableListItem>
        );
      })}
    </ul>
  );
};

export default ChartList;
