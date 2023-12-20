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
      <div className="page-title pb-2 mb-3 d-flex justify-content-between align-items-center">
        <h1>My Teams</h1>
        <div className="col-6 col-md-9 fin-btn-group text-end">
          <Link to="/teams/create" className="btn btn-new override-end">
            <FontAwesomeIcon icon={faPlus} />
            Create New Team
          </Link>
        </div>
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
    </div>
  );
};

export default MyTeams;
