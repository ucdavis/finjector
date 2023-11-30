import React from "react";
import { SearchBar } from "../../components/Shared/SearchBar";
import { useGetMyTeams } from "../../queries/teamQueries";
import TeamList from "../../components/Teams/TeamList";

const MyTeams: React.FC = () => {
  const [search, setSearch] = React.useState("");

  const myTeams = useGetMyTeams();

  return (
    <div>
      <div className="page-title mb-3">
        <h1>My Teams</h1>
      </div>
      <div className="mb-3">
        <SearchBar
          placeholderText="Search My Teams"
          search={search}
          setSearch={setSearch}
        />
      </div>
      <div className="mb-3">
        <TeamList teamsInfo={myTeams.data} filter={search} />
      </div>
      <button className="btn btn-new me-3" type="button">
        Create New Team
      </button>
    </div>
  );
};

export default MyTeams;
