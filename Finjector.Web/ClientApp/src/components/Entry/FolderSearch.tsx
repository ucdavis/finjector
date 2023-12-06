import React, { Fragment, useState } from "react";
import {
  AsyncTypeahead,
  Highlighter,
  Hint,
  Menu,
  MenuItem,
  Token,
} from "react-bootstrap-typeahead";
import { groupBy } from "lodash";
import { useSearchFolders } from "../../queries/folderQueries";
import { Folder } from "../../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder } from "@fortawesome/free-solid-svg-icons";
import { Input, InputProps } from "reactstrap";
import { TypeaheadInputProps } from "react-bootstrap-typeahead/types/types";

type SharedKeys = keyof InputProps & keyof TypeaheadInputProps;
type SharedProps = Pick<InputProps, SharedKeys>;

const FolderSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<Folder | undefined>();

  const { data, isError, isFetching } = useSearchFolders(searchTerm);

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
        // defaultInputValue={props.segmentData.code}
        onChange={handleSelected}
        useCache={false}
        options={data || []} // data
        placeholder={`Search for Folder...`}
        renderMenu={(results, menuProps) => {
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
      <div className="form-text">form text</div>
    </div>
  );
};

export default FolderSearch;
