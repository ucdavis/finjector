import React from "react";
import { Folder } from "../../types";
import { faFileLines, faFileExport } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FinjectorButton from "../Shared/FinjectorButton";

interface ImportListFolderRowProps {
  folder: Folder;
}

const ImportListFolderRow = (props: ImportListFolderRowProps) => {
  // Your component logic goes here

  return (
    <div className="import-folder-row d-flex align-items-center justify-content-between">
      <div className="col-7">
        <h3 className="mb-0">{props.folder.name}</h3>
      </div>
      <div className="col-5 d-flex justify-content-end align-items-center">
        <div className="stat-icon">
          <FontAwesomeIcon
            title="Chart string count in folder"
            icon={faFileLines}
          />
          {props.folder.coas.length}
        </div>
        <FinjectorButton className="ms-2 btn-borderless" to={`#`}>
          <FontAwesomeIcon icon={faFileExport} />
          Import Folder
        </FinjectorButton>
      </div>
    </div>
  );
};

export default ImportListFolderRow;
