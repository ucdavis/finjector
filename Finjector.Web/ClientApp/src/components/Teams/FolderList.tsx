import React from "react";

import FinLoader from "../FinLoader";

import {TeamResponseModel, TeamsResponseModel} from "../../types";
import { Link } from "react-router-dom";

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
        <li
          className="fin-item d-flex justify-content-between align-items-center saved-list-item"
          key={folderInfo.folder.id}
        >
          <div className="col-9 ms-2 me-auto">
            <div className="fw-bold "> {folderInfo.folder.name}</div>
            <Link to={`/teams/${teamModel.team.id}/folders/${folderInfo.folder.id}`}>Go to Folder</Link>
          </div>
          <div className="col-3">
            { folderInfo.chartCount } | { folderInfo.folderMemberCount }
          </div>
        </li>
      ))}
    </ul>
  );
};

export default FolderList;
