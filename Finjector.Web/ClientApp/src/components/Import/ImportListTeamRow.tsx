import { faFileLines, faFileExport } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

import { Coa, TeamGroupedCoas } from '../../types';
import FinButton from '../Shared/FinButton';

import ImportListFolderRow from './ImportListFolderRow';

interface ImportListTeamRowProps {
  teamGroup: TeamGroupedCoas;
  onImport: (chartStrings: Coa[]) => void;
}

const ImportListTeamRow = (props: ImportListTeamRowProps) => {
  const importChartStrings = () => {
    // get all the chart strings from the team group
    const chartStrings = props.teamGroup.folders.reduce(
      (acc, folder) => acc.concat(folder.coas),
      [] as Coa[]
    );

    props.onImport(chartStrings);
  };

  return (
    <li className='fin-row saved-list-item'>
      <div className='fin-info d-flex justify-content-between align-items-center'>
        <div className='col-7 ms-2'>
          <h3 className='row-title'>{props.teamGroup.team.name}</h3>
        </div>
        <div className='col-2'>
          <div className='stat-icon team-coa-counter'>
            <FontAwesomeIcon
              title='Chart string count in team'
              icon={faFileLines}
            />
            {props.teamGroup.folders.reduce(
              (acc, folder) => acc + folder.coas.length,
              0
            )}
          </div>
        </div>
        <div className='col-3 text-end'>
          <FinButton className='me-1' onClick={importChartStrings}>
            <FontAwesomeIcon icon={faFileExport} />
            Import Team
          </FinButton>
        </div>
      </div>
      {props.teamGroup.folders.map((folder) => {
        return (
          <ImportListFolderRow
            key={folder.id}
            folder={folder}
            onImport={props.onImport}
          />
        );
      })}
    </li>
  );
};

export default ImportListTeamRow;
