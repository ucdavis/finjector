import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { SearchBar } from "../../components/Shared/SearchBar";
import { useGetMyTeams } from "../../queries/teamQueries";
import TeamList from "../../components/Teams/TeamList";
import FinButton from "../../components/Shared/FinButton";
import PageTitle from "../../components/Shared/Layout/PageTitle";
import PageBody from "../../components/Shared/Layout/PageBody";
import { FinQueryStatus } from "../../types";

const MyTeams: React.FC = () => {
  const [search, setSearch] = React.useState("");

  const myTeamsQuery = useGetMyTeams();

  const queryStatus: FinQueryStatus = {
    isError: myTeamsQuery.isError,
    isInitialLoading: myTeamsQuery.isInitialLoading,
    error: myTeamsQuery.error,
  };

  return (
    <div>
      <PageTitle>
        <div className="col-12 col-md-8">
          <h1>
            {queryStatus.isError
              ? "Error loading Teams"
              : queryStatus.isInitialLoading
              ? "Scribbling in Your Teams..."
              : "My Teams"}
          </h1>
        </div>
        <div className="col-12 col-md-4 text-end">
          <FinButton to="/teams/create">
            <FontAwesomeIcon icon={faPlus} />
            Create New Team
          </FinButton>
        </div>
      </PageTitle>
      <PageBody>
        <SearchBar
          placeholderText="Search My Teams"
          search={search}
          setSearch={setSearch}
        />
        <TeamList
          teamsInfo={myTeamsQuery.data}
          filter={search}
          queryStatus={queryStatus}
        />
      </PageBody>
    </div>
  );
};

export default MyTeams;
