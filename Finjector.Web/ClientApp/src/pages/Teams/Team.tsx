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
      <div className="page-title mb-3">
        <h1>{teamModel.data?.team.name}</h1>
      </div>
      <div className="mb-3">
        <SearchBar
          placeholderText={
            !!teamModel.data?.team.name
              ? `Search Within ${teamModel.data?.team.name}`
              : "Search My Teams"
          }
          search={search}
          setSearch={setSearch}
        />
      </div>
      <div className="mb-3">
        <FolderList teamModel={teamModel.data} filter={search} />
      </div>
      <button className="btn btn-new me-3" type="button">
        Create New Folder
      </button>
    </div>
  );
};

export default Team;
