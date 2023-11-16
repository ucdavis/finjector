import React from "react";

import FinLoader from "../FinLoader";

import { TeamsResponseModel } from "../../types";
import { Link } from "react-router-dom";

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
        <li
          className="fin-item d-flex justify-content-between align-items-center saved-list-item"
          key={teamInfo.team.id}
        >
          <div className="col-9 ms-2 me-auto">
            <div className="fw-bold "> {teamInfo.team.name}</div>
            <Link to={`/teams/${teamInfo.team.id}`}>Go to Team</Link>
            <span style={{ wordWrap: "break-word" }}>
              Admins: {teamInfo.admins.join(", ")}
            </span>
          </div>
          <div className="col-3">
            {teamInfo.chartCount} | {teamInfo.folderCount} |{" "}
            {teamInfo.teamPermissionCount + teamInfo.folderPermissionCount}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default ChartList;
