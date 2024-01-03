import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { SearchBar } from "../../components/Shared/SearchBar";
import { useGetMyTeams } from "../../queries/teamQueries";
import TeamList from "../../components/Teams/TeamList";
import FinjectorButton from "../../components/Shared/FinjectorButton";

const MyTeams: React.FC = () => {
  const [search, setSearch] = React.useState("");

  const myTeams = useGetMyTeams();

  return (
    <div>
      <div className="page-title pb-2 mb-3 row justify-content-between align-items-center">
        <div className="col-12 col-md-8">
          <h1>My Teams</h1>
        </div>
        <div className="col-12 col-md-4 text-end">
          <FinjectorButton to="/teams/create">
            <FontAwesomeIcon icon={faPlus} />
            Create New Team
          </FinjectorButton>
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
