import React from "react";
import { SearchBar } from "../../components/Shared/SearchBar";
import { useGetTeam } from "../../queries/teamQueries";
import { Link, useParams } from "react-router-dom";
import FolderList from "../../components/Teams/FolderList";
import FinLoader from "../../components/Shared/FinLoader";
import DeleteTeam from "../../components/Teams/DeleteTeam";
import LeaveTeam from "../../components/Teams/LeaveTeam";
import { BackLinkBar } from "../../components/Shared/BackLinkBar";

const Team: React.FC = () => {
  // get id from url
  const { id = "" } = useParams<{ id: string }>();

  const [search, setSearch] = React.useState("");

  const teamModel = useGetTeam(id);

  if (teamModel.isLoading) {
    return <FinLoader />;
  }

  return (
    <div>
      <BackLinkBar />
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
      <div>
        <Link to={`/teams/${id}/create`} className="btn btn-new me-3">
          Create New Folder
        </Link>
        <Link to={`/teams/${id}/edit`} className="btn btn-new me-3">
          Edit Team (TODO)
        </Link>
        <Link to={`/teams/${id}/permissions`} className="btn btn-new me-3">
          Manage Team Users
        </Link>
        {teamModel.data?.team.myTeamPermissions.some((p) => p === "Admin") && (
          <DeleteTeam teamId={id} />
        )}
        <LeaveTeam
          teamId={id}
          myPermissions={teamModel.data?.team.myTeamPermissions || []}
        />
      </div>
      <div className="mb-3">
        <FolderList teamModel={teamModel.data} filter={search} />
      </div>
    </div>
  );
};

export default Team;
