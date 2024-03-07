import { faPlus, faPaperclip } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

import ChartList from '../components/Landing/ChartList';
import FinButton from '../components/Shared/FinButton';
import PageBody from '../components/Shared/Layout/PageBody';
import PageTitle from '../components/Shared/Layout/PageTitle';
import { SearchBar } from '../components/Shared/SearchBar';
import { useGetSavedCharts } from '../queries/storedChartQueries';
import { FinQueryStatus } from '../types';
import { useFinQueryStatus } from '../util/error';

// Main landing screen for popup

const Landing = () => {
  const [search, setSearch] = React.useState('');

  const savedChartsQuery = useGetSavedCharts();

  const queryStatus: FinQueryStatus = useFinQueryStatus(savedChartsQuery);

  return (
    <div>
      <PageTitle>
        <div className='col-12 col-md-4'>
          <h1>
            {queryStatus.isError
              ? 'Error loading your Chart Strings'
              : queryStatus.isLoading
                ? 'Scribbling in your Chart Strings...'
                : 'My Chart Strings'}
          </h1>
        </div>
        <div className='col-12 col-md-8 text-end'>
          <FinButton to='/entry'>
            <FontAwesomeIcon icon={faPlus} />
            New Chart String from Scratch
          </FinButton>

          <FinButton to='/paste'>
            <FontAwesomeIcon icon={faPaperclip} />
            New Chart String from Paste
          </FinButton>
        </div>
      </PageTitle>
      <PageBody>
        <SearchBar
          placeholderText='Search my chart strings, teams and folders'
          search={search}
          setSearch={setSearch}
        />
        <ChartList
          teamGroups={savedChartsQuery.data}
          filter={search}
          queryStatus={queryStatus}
        />
      </PageBody>
    </div>
  );
};

export default Landing;
