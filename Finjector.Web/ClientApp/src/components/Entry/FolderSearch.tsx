import { faFolder } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { groupBy } from 'lodash';
import { Fragment, useEffect, useRef, useState } from 'react';
import {
  Highlighter,
  Menu,
  MenuItem,
  Typeahead,
} from 'react-bootstrap-typeahead';
import { InputGroup, InputGroupText } from 'reactstrap';

import { useGetFolderSearchList } from '../../queries/folderQueries';
import { Folder } from '../../types';

interface FolderSearchProps {
  updateFolderId: (folderId: number) => void;
  selectedFolderId?: number;
  disabled?: boolean;
  // where the chart is currently saved (this will not change when the user selects a new folder from the input)
  currentlySavedInFolderId?: number;
}

const FolderSearch: React.FC<FolderSearchProps> = ({
  updateFolderId,
  selectedFolderId,
  disabled,
  currentlySavedInFolderId,
}) => {
  const [selectedFolder, setSelectedFolder] = useState<Folder | undefined>();

  const typeaheadRef = useRef<any>();
  const initialFolderId = useRef(selectedFolderId);

  const query = useGetFolderSearchList();

  useEffect(() => {
    // when data loads, set the state of the typeahead to the selected folder
    // so that it pre-populates the dropdown with the correct folder
    // only need to do this once, otherwise it causes weird issues on clear
    if (query.data) {
      const folder = query.data.find((f) => f.id === initialFolderId.current);
      if (folder) {
        // if it already has a folder that user has permission to save to, set it to that
        setSelectedFolder(folder);
      } else {
        // otherwise, set it to the default
        setSelectedFolder(
          query.data.find(
            (f) => f.teamName === 'Personal' && f.name === 'Default'
          )
        );
      }
    }
  }, [query.data, initialFolderId]);

  const handleSelected = (selected: any[]) => {
    setSelectedFolder(selected[0]);
    updateFolderId(selected[0]?.id ?? 0);

    // If the selected array is empty, clear the input and focus it
    if (selected.length === 0) {
      typeaheadRef.current?.blur();
      typeaheadRef.current?.focus();
    }
  };

  return (
    <>
      <h2>Folder</h2>
      <p>Choose where you would like to store your chart string</p>
      <InputGroup aria-disabled={disabled}>
        <InputGroupText aria-disabled={disabled}>
          {selectedFolder?.teamName ?? 'Personal'}
        </InputGroupText>
        <Typeahead
          id={'typeahead-folder-search'}
          filterBy={['name', 'teamName']}
          ref={typeaheadRef}
          isLoading={query.isFetching}
          labelKey='name'
          placeholder='Default'
          selected={selectedFolder ? [selectedFolder] : []}
          onChange={handleSelected}
          options={query.data || []} // data
          clearButton={true}
          disabled={disabled}
          renderMenu={(
            results,
            {
              // we are extracting these out so that we don't pass them to the Menu component
              /* eslint-disable @typescript-eslint/no-unused-vars */
              newSelectionPrefix,
              paginationText,
              renderMenuItemChildren,
              ...menuProps
              /* eslint-enable @typescript-eslint/no-unused-vars */
            },
            { text }
          ) => {
            let index = 0;
            const teamFolders = groupBy(results, 'teamName');
            const items = Object.keys(teamFolders)
              .sort()
              .map((teamName) => (
                <Fragment key={teamName}>
                  {index !== 0 && <Menu.Divider />}
                  <Menu.Header>
                    <h5>
                      Team: <Highlighter search={text}>{teamName}</Highlighter>
                    </h5>
                  </Menu.Header>
                  {teamFolders[teamName].map((folder: any) => {
                    const item = (
                      <MenuItem key={index} option={folder} position={index}>
                        <FontAwesomeIcon icon={faFolder} />{' '}
                        <span>
                          <Highlighter search={text}>{folder.name}</Highlighter>
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
      {!!currentlySavedInFolderId && (
        <div className='form-text'>
          Current Team:{' '}
          {query.data?.find((f) => f.id === currentlySavedInFolderId)?.teamName}
          <br />
          Current Folder:{' '}
          {query.data?.find((f) => f.id === currentlySavedInFolderId)?.name}
        </div>
      )}
    </>
  );
};

export default FolderSearch;
