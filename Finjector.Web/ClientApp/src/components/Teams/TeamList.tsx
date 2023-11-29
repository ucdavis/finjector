import React from "react";

import FinLoader from "../Shared/FinLoader";

import { TeamsResponseModel } from "../../types";
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolderOpen,
  faUsers,
  faBolt,
  faList,
} from "@fortawesome/free-solid-svg-icons";

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
      {filteredTeamsInfo.map((teamInfo) => (
        <li className="fin-row saved-list-item" key={teamInfo.team.id}>
          <div className="fin-info d-flex justify-content-between align-items-center">
            <div className="col-9 ms-2 me-auto">
              <h3 className="row-title">{teamInfo.team.name}</h3>
              <p className="row-subtitle">
                <span style={{ wordWrap: "break-word" }}>
                  Admins: {teamInfo.admins.join(", ")}
                </span>
              </p>
            </div>
            <div className="col-3 d-flex justify-content-end">
              <div className="stat-icon">
                <FontAwesomeIcon icon={faFolderOpen} />
                {teamInfo.folderCount}{" "}
              </div>
              <div className="stat-icon">
                <FontAwesomeIcon icon={faUsers} />
                {teamInfo.teamPermissionCount + teamInfo.folderPermissionCount}
              </div>
              <div className="stat-icon">
                <FontAwesomeIcon icon={faBolt} />
                {teamInfo.chartCount}
              </div>
            </div>
          </div>
          <div className="fin-actions">
            <Link className="bold-link" to={`/teams/${teamInfo.team.id}`}>
              <FontAwesomeIcon icon={faList} />
              Go to Team
            </Link>
            {!teamInfo.team.isPersonal && (
              <Link
                className="bold-link"
                to={`/teams/${teamInfo.team.id}/permissions`}
              >
                <FontAwesomeIcon icon={faList} />
                Manage Users
              </Link>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default ChartList;
