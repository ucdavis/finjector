import React from "react";
import { SearchBar } from "../../components/SearchBar";
import { useGetTeam } from "../../queries/teamQueries";
import { Link, useParams } from "react-router-dom";
import FolderList from "../../components/Teams/FolderList";

const Team: React.FC = () => {
  // get id from url
  const { id } = useParams<{ id: string }>();

  const [search, setSearch] = React.useState("");

  const teamModel = useGetTeam(id);

  return (
    <div>
      <div className="page-title mb-3">
        <h1>{teamModel.data?.team.name}</h1>
      </div>
      <div className="mb-3"></div>
      <SearchBar
        placeholderText={
          !!teamModel.data?.team.name
            ? `Search Within ${teamModel.data?.team.name}`
            : "Search My Teams"
        }
        search={search}
        setSearch={setSearch}
      />
      <div className="mb-3">
        <FolderList teamModel={teamModel.data} filter={search} />
      </div>
      <Link to={`/teams/${id}/create`} className="btn btn-new me-3">
        Create New Folder
      </Link>
    </div>
  );
};

export default Team;
