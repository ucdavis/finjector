import React from "react";
import { Folder } from "../../types";
import { faFileLines, faFileExport } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FinjectorButton from "../Shared/FinjectorButton";

interface ImportListFolderRowProps {
  folder: Folder;
}

const ImportListFolderRow = (props: ImportListFolderRowProps) => {
  return (
    <div className="import-folder-row d-flex align-items-center justify-content-between">
      <div className="col-7">
        <h3 className="mb-0 ms-2">{props.folder.name}</h3>
      </div>
      <div className="col-2">
        <div className="stat-icon">
          <FontAwesomeIcon
            title="Chart string count in folder"
            icon={faFileLines}
          />
          {props.folder.coas.length}
        </div>
      </div>
      <div className="col-3 text-end">
        <FinjectorButton className="ms-2 btn-borderless" to={`#`}>
          <FontAwesomeIcon icon={faFileExport} />
          Import Folder
        </FinjectorButton>
      </div>
    </div>
  );
};

export default ImportListFolderRow;
