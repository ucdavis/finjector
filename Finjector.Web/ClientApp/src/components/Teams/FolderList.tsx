import React from "react";

import FinLoader from "../FinLoader";

import { TeamResponseModel, TeamsResponseModel } from "../../types";
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faBolt } from "@fortawesome/free-solid-svg-icons";

interface Props {
  teamModel: TeamResponseModel | undefined;
  filter: string;
}

const FolderList = (props: Props) => {
  const { teamModel } = props;

  if (!teamModel) {
    return <FinLoader />;
  }

  const filterLowercase = props.filter.toLowerCase();

  const filteredFolderInfo = teamModel.folders.filter((f) => {
    return f.folder.name.toLowerCase().includes(filterLowercase);
  });

  return (
    <ul className="list-group">
      {filteredFolderInfo.map((folderInfo) => (
        <li className="fin-row saved-list-item" key={folderInfo.folder.id}>
          <div className="fin-info d-flex justify-content-between align-items-center">
            <div className="col-9 ms-2 me-auto">
              <div className="row-title">
                <h3>{folderInfo.folder.name}</h3>
              </div>
            </div>
            <div className="col-3 d-flex justify-content-end">
              <div className="stat-icon">
                <FontAwesomeIcon icon={faUsers} />
                {folderInfo.folderMemberCount}
              </div>
              <div className="stat-icon">
                <FontAwesomeIcon icon={faBolt} />
                {folderInfo.chartCount}
              </div>
            </div>
          </div>
          <div className="fin-actions">
            <Link
              className="bold-link"
              to={`/teams/${teamModel.team.id}/folders/${folderInfo.folder.id}`}
            >
              Go to Folder
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default FolderList;
