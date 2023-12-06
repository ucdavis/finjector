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
import { Input, InputGroup, InputGroupText, InputProps } from "reactstrap";
import { TypeaheadInputProps } from "react-bootstrap-typeahead/types/types";

// to resolve type differences between reactstrap and react-bootstrap-typeahead for input props
type SharedKeys = keyof InputProps & keyof TypeaheadInputProps;
type SharedProps = Pick<InputProps, SharedKeys>;

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
          const { inputRef, ...rest } = inputProps;
          const {
            referenceElementRef, // we dont want to pass this to the input or gives a warning: "React does not recognize the refEl... prop on a DOM element."
            ...sharedProps
          }: SharedProps = rest as SharedProps;

          const selected: any = props.selected[0]; // will always be a single selection
          return (
            <Hint>
              <InputGroup>
                <InputGroupText>
                  {selected?.teamName ?? "Personal"}
                </InputGroupText>
                <Input
                  {...sharedProps}
                  innerRef={inputRef}
                  aria-owns="typeahead-folder-search"
                ></Input>
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
