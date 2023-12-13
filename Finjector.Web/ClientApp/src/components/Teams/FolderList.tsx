import React from "react";

import FinLoader from "../Shared/FinLoader";

import { TeamResponseModel } from "../../types";
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faDollarSign,
  faFolder,
} from "@fortawesome/free-solid-svg-icons";
import ClickableListItem from "../Shared/ClickableListItem";

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
      {filteredFolderInfo.map((folderInfo) => {
        const url = `/teams/${teamModel.team.id}/folders/${folderInfo.folder.id}`;
        return (
          <ClickableListItem
            className="fin-row"
            key={folderInfo.folder.id}
            url={url}
          >
            <div className="fin-info d-flex justify-content-between align-items-center">
              <div className="col-9 ms-2 me-auto">
                <div className="row-title">
                  <h3>{folderInfo.folder.name}</h3>
                </div>
                <p className="row-subtitle">
                  <span style={{ wordWrap: "break-word" }}>
                    {folderInfo.folder.description}
                  </span>
                </p>
              </div>
              <div className="col-3 d-flex justify-content-end">
                <div className="stat-icon">
                  <FontAwesomeIcon
                    title="User count in folder"
                    icon={faUsers}
                  />
                  {folderInfo.uniqueUserPermissionCount}
                </div>
                <div className="stat-icon">
                  <FontAwesomeIcon
                    title="Chart string count in folder"
                    icon={faDollarSign}
                  />
                  {folderInfo.chartCount}
                </div>
              </div>
            </div>
            <div className="fin-actions">
              <Link
                className="bold-link me-3 row-link-selected-action"
                to={url}
              >
                <FontAwesomeIcon icon={faFolder} />
                Go to Folder
              </Link>
            </div>
          </ClickableListItem>
        );
      })}
    </ul>
  );
};

export default FolderList;
