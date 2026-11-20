import React from "react";
import { Coa, Folder } from "../../types";
import { faFileLines, faFileExport } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FinButton from "../Shared/FinButton";

interface ImportListFolderRowProps {
  folder: Folder;
  onImport: (chartStrings: Coa[]) => void;
}

const ImportListFolderRow = (props: ImportListFolderRowProps) => {
  const importChartStrings = () => {
    // get all the chart strings from the team group
    const chartStrings = props.folder.coas;

    props.onImport(chartStrings);
  };

  return (
    <div className="import-folder-row d-flex flex-wrap align-items-center">
      <div className="col-12 col-md-7 text-break">
        <h3 className="mb-0 ms-2">{props.folder.name}</h3>
      </div>
      <div className="col-4 col-md-2">
        <div className="stat-icon">
          <FontAwesomeIcon
            title="Chart string count in folder"
            icon={faFileLines}
          />
          {props.folder.coas.length}
        </div>
      </div>
      <div className="col-8 col-md-3 text-end">
        <FinButton
          className="ms-2 btn-borderless"
          aria-label={`Import Folder: ${props.folder.name}`}
          onClick={importChartStrings}
        >
          <FontAwesomeIcon icon={faFileExport} />
          Import Folder
        </FinButton>
      </div>
    </div>
  );
};

export default ImportListFolderRow;
