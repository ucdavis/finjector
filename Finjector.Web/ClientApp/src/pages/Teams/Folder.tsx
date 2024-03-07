import React from 'react';
import { useParams } from 'react-router-dom';

import ChartListSimple from '../../components/Folders/ChartListSimple';
import FolderTitle from '../../components/Folders/FolderTitle';
import PageBody from '../../components/Shared/Layout/PageBody';
import { SearchBar } from '../../components/Shared/SearchBar';
import { useGetFolder } from '../../queries/folderQueries';
import { FinQueryStatus } from '../../types';
import { useFinQueryStatus } from '../../util/error';

// show folder info w/ charts
const Folder: React.FC = () => {
  const { teamId = '', folderId = '' } = useParams<{
    teamId: string;
    folderId: string;
  }>();

  const [search, setSearch] = React.useState('');

  const folderModelQuery = useGetFolder(folderId);

  const queryStatus: FinQueryStatus = useFinQueryStatus(folderModelQuery);

  return (
    <div>
      <FolderTitle
        folderModelData={folderModelQuery.data}
        queryStatus={queryStatus}
        teamId={teamId}
        folderId={folderId}
      />
      <PageBody>
        <SearchBar
          placeholderText='Search Within Folder'
          search={search}
          setSearch={setSearch}
        />
        <ChartListSimple
          charts={folderModelQuery.data?.charts}
          folder={folderModelQuery.data?.folder}
          filter={search}
          queryStatus={queryStatus}
        />
      </PageBody>
    </div>
  );
};

export default Folder;
