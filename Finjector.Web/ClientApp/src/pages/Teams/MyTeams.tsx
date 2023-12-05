import React from "react";
import { SearchBar } from "../../components/Shared/SearchBar";
import { useGetMyTeams } from "../../queries/teamQueries";
import TeamList from "../../components/Teams/TeamList";
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

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
      <div>
        <Link to="/teams/create" className="btn btn-new me-3">
          <FontAwesomeIcon icon={faPlus} />
          Create New Team
        </Link>
      </div>
      <div className="mb-3">
        <TeamList teamsInfo={myTeams.data} filter={search} />
      </div>
    </div>
  );
};

export default MyTeams;
