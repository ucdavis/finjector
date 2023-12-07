import React, { Fragment, useState } from "react";
import {
  AsyncTypeahead,
  Highlighter,
  Menu,
  MenuItem,
} from "react-bootstrap-typeahead";
import { groupBy } from "lodash";
import { useSearchFolders } from "../../queries/folderQueries";
import { Folder } from "../../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder } from "@fortawesome/free-solid-svg-icons";
import { InputGroup, InputGroupText } from "reactstrap";

interface FolderSearchProps {
  updateFolderId: (folderId: number) => void;
  minQueryLength?: number;
}

const FolderSearch = ({
  updateFolderId: updateFolder,
  minQueryLength = 3,
}: FolderSearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<Folder | undefined>();

  const { data, isFetching } = useSearchFolders(searchTerm);

  const handleInputChange = (
    text: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchTerm(text);
  };

  const handleSelected = (selected: any[]) => {
    setSelectedFolder(selected[0]);
    updateFolder(selected[0]?.id ?? 0);
  };

  return (
    <div className="mb-3 col-sm-6">
      <label className="form-label">Folder Search</label>
      <InputGroup>
        <InputGroupText>
          {selectedFolder?.teamName ?? "Personal"}
        </InputGroupText>
        <AsyncTypeahead
          id={"typeahead-folder-search"}
          filterBy={() => true} // don't filter since we're doing it on the server
          isLoading={isFetching}
          labelKey="name"
          minLength={minQueryLength}
          onSearch={() => {}}
          onInputChange={handleInputChange}
          defaultSelected={selectedFolder ? [selectedFolder] : []}
          onChange={handleSelected}
          useCache={false}
          options={data || []} // data
          placeholder={`Default`} // instead of having a default, just use placeholder
          clearButton={true}
          renderMenu={(
            results,
            {
              newSelectionPrefix, // we dont want to pass this to the menu or gives a warning
              paginationText,
              renderMenuItemChildren,
              ...menuProps
            }
          ) => {
            let index = 0;
            const teamFolders = groupBy(results, "teamName");
            const items = Object.keys(teamFolders)
              .sort()
              .map((teamName) => (
                <Fragment key={teamName}>
                  {index !== 0 && <Menu.Divider />}
                  <Menu.Header>
                    <h5>
                      Team:{" "}
                      <Highlighter search={searchTerm}>{teamName}</Highlighter>
                    </h5>
                  </Menu.Header>
                  {teamFolders[teamName].map((folder: any) => {
                    const item = (
                      <MenuItem key={index} option={folder} position={index}>
                        <FontAwesomeIcon icon={faFolder} />{" "}
                        <span>
                          <Highlighter search={searchTerm}>
                            {folder.name}
                          </Highlighter>
                        </span>
                      </MenuItem>
                    );

                    index += 1;
                    return item;
                  })}
                </Fragment>
              ));

            return <Menu {...menuProps}>{items}</Menu>;
          }}
        />
      </InputGroup>
    </div>
  );
};

export default FolderSearch;
