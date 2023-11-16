import React from "react";
import { SearchBar } from "../../components/SearchBar";
import { useGetTeam } from "../../queries/teamQueries";
import { useParams } from "react-router-dom";
import FolderList from "../../components/Teams/FolderList";

const Team: React.FC = () => {
  // get id from url
  const { id } = useParams<{ id: string }>();

  const [search, setSearch] = React.useState("");

  const teamModel = useGetTeam(id);

  return (
    <div>
      <SearchBar
        placeholderText="Search My Teams"
        search={search}
        setSearch={setSearch}
      />

      <h3>Team name: {teamModel.data?.team.name}</h3>
      <FolderList teamModel={teamModel.data} filter={search} />
      <button
        className="btn btn-outline-secondary flex-fill me-3"
        type="button"
      >
        Create New Team
      </button>
    </div>
  );
};

export default Team;
