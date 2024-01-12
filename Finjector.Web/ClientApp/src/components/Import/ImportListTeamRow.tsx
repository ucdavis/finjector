import React from "react";
import { TeamGroupedCoas } from "../../types";
import { faFileLines, faFileExport } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FinjectorButton from "../Shared/FinjectorButton";
import ImportListFolderRow from "./ImportListFolderRow";

interface ImportListTeamRowProps {
  teamGroup: TeamGroupedCoas;
}

const ImportListTeamRow = (props: ImportListTeamRowProps) => {
  return (
    <li className="fin-row saved-list-item">
      <div className="fin-info d-flex justify-content-between align-items-center">
        <div className="col-7 ms-2">
          <h3 className="row-title">{props.teamGroup.team.name}</h3>
        </div>
        <div className="col-5 d-flex justify-content-end align-items-center">
          <div className="stat-icon">
            <FontAwesomeIcon
              title="Chart string count in team"
              icon={faFileLines}
            />
            {props.teamGroup.folders.reduce(
              (acc, folder) => acc + folder.coas.length,
              0
            )}
          </div>
          <FinjectorButton to={`#`} className="me-1">
            <FontAwesomeIcon icon={faFileExport} />
            Import Team
          </FinjectorButton>
        </div>
      </div>
      {props.teamGroup.folders.map((folder) => {
        return <ImportListFolderRow key={folder.id} folder={folder} />;
      })}
    </li>
  );
};

export default ImportListTeamRow;
