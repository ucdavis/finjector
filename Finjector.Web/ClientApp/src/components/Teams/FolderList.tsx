import React from "react";

import FinLoader from "../Shared/LoadingAndErrors/FinLoader";

import { FinQueryStatus, TeamResponseModel } from "../../types";
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faFileLines,
  faFolder,
} from "@fortawesome/free-solid-svg-icons";
import ClickableListItem from "../Shared/ClickableListItem";
import { useFinQueryStatusHandler } from "../../util/error";
import FinFunError from "../Shared/LoadingAndErrors/FinFunError";
import FinEmpty from "../Shared/LoadingAndErrors/FinEmpty";

interface Props {
  teamModel: TeamResponseModel | undefined;
  filter: string;
  queryStatus: FinQueryStatus;
}

const FolderList: React.FC<Props> = ({ teamModel, filter, queryStatus }) => {
  const queryStatusComponent = useFinQueryStatusHandler({
    queryStatus,
  });

  if (queryStatusComponent) return <>{queryStatusComponent}</>;

  // if the query did not throw any errors but somehow still returned null
  // this shouldn't happen, but it makes the type checker happy. :)
  if (!teamModel) return <FinFunError />;
  // if we have successfully loaded the team but there are no folders (not an error)
  if (teamModel.folders.length === 0) {
    return <FinEmpty title="There are no folders in this team." />;
  }
  const filterLowercase = filter.toLowerCase();

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
              <div className="col-8 ms-2 me-auto">
                <h3 className="row-title">{folderInfo.folder.name}</h3>
                <p className="row-subtitle">
                  <span style={{ wordWrap: "break-word" }}>
                    {folderInfo.folder.description}
                  </span>
                </p>
              </div>
              <div className="col-4 d-flex justify-content-end">
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
                    icon={faFileLines}
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
