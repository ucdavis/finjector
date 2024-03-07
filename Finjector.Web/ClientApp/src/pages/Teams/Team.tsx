import React from 'react';
import { useParams } from 'react-router-dom';

import PageBody from '../../components/Shared/Layout/PageBody';
import { SearchBar } from '../../components/Shared/SearchBar';
import FolderList from '../../components/Teams/FolderList';
import TeamTitle from '../../components/Teams/TeamTitle';
import { useGetTeam } from '../../queries/teamQueries';
import { FinQueryStatus } from '../../types';
import { useFinQueryStatus } from '../../util/error';

const Team: React.FC = () => {
  // get id from url
  const { teamId = '' } = useParams<{ teamId: string }>();

  const [search, setSearch] = React.useState('');

  const teamModelQuery = useGetTeam(teamId);

  const queryStatus: FinQueryStatus = useFinQueryStatus(teamModelQuery);

  return (
    <div>
      <TeamTitle
        teamModelData={teamModelQuery.data}
        queryStatus={queryStatus}
        teamId={teamId}
      />
      <PageBody>
        <SearchBar
          placeholderText={
            teamModelQuery.data?.team.name
              ? `Search Within ${teamModelQuery.data?.team.name}`
              : 'Search Within Team'
          }
          search={search}
          setSearch={setSearch}
        />
        <FolderList
          teamModel={teamModelQuery.data}
          filter={search}
          queryStatus={queryStatus}
        />
      </PageBody>
    </div>
  );
};

export default Team;
