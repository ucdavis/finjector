import React, { Fragment, useState } from "react";
import {
  AsyncTypeahead,
  Highlighter,
  Hint,
  Menu,
  MenuItem,
} from "react-bootstrap-typeahead";
import { groupBy } from "lodash";
import { useSearchFolders } from "../../queries/folderQueries";
import { Folder } from "../../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder } from "@fortawesome/free-solid-svg-icons";
import { Input, InputGroup, InputGroupText } from "reactstrap";

const FolderSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<Folder>({
    id: 0,
    name: "Default",
    teamName: "Personal",
    teamId: 0,
    description: "",
    myFolderPermissions: [],
    myTeamPermissions: [],
    coas: [],
  });

  const { data, isFetching } = useSearchFolders(searchTerm);

  const handleInputChange = (
    text: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchTerm(text);
  };

  const handleSelected = (selected: any) => {
    setSelectedFolder(selected[0]);
  };

  return (
    <div className="mb-3 col-sm-6">
      <label className="form-label">Folder Search</label>
      <AsyncTypeahead
        id={"typeahead-folder-search"}
        filterBy={() => true} // don't filter since we're doing it on the server
        isLoading={isFetching}
        labelKey="name"
        //   minLength={minQueryLength}
        onSearch={() => {}}
        onInputChange={handleInputChange}
        defaultInputValue="Default"
        onChange={handleSelected}
        useCache={false}
        options={data || []} // data
        placeholder={`Search for Folder...`}
        renderMenu={(
          results,
          {
            newSelectionPrefix, // we dont want to pass this to the menu or it gets mad
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
        renderInput={(inputProps, props) => {
          const { inputRef, type, referenceElementRef, ...rest } = inputProps; // have to separate these out to get the types to play nice
          const selected: any = props.selected[0]; // will always be a single selection
          return (
            <Hint>
              <InputGroup>
                <InputGroupText>
                  {selected?.teamName ?? "Personal"}
                </InputGroupText>
                <Input {...rest} type="search" innerRef={inputRef}></Input>
              </InputGroup>
            </Hint>
          );
        }}
      />
      <div className="form-text">
        Team: {selectedFolder?.teamName}, Folder: {selectedFolder?.name}
      </div>
    </div>
  );
};

export default FolderSearch;
