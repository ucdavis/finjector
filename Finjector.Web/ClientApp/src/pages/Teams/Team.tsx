import React from "react";
import { SearchBar } from "../../components/Shared/SearchBar";
import { useGetTeam } from "../../queries/teamQueries";
import { Link, useParams } from "react-router-dom";
import FolderList from "../../components/Teams/FolderList";
import FinLoader from "../../components/Shared/FinLoader";
import DeleteTeam from "../../components/Teams/DeleteTeam";
import LeaveTeam from "../../components/Teams/LeaveTeam";
import { BackLinkBar } from "../../components/Shared/BackLinkBar";
import { isPersonalOrDefault } from "../../util/teamDefinitions";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faUsers,
  faPencil,
  faUserTie,
} from "@fortawesome/free-solid-svg-icons";

const Team: React.FC = () => {
  // get id from url
  const { id = "" } = useParams<{ id: string }>();

  const [search, setSearch] = React.useState("");

  const teamModel = useGetTeam(id);

  if (teamModel.isLoading) {
    return <FinLoader />;
  }

  if (teamModel.error) {
    return (
      <div>
        Something went wrong. Ensure you have permission to view this team.
      </div>
    );
  }

  const isTeamAdmin = teamModel.data?.team.myTeamPermissions.some(
    (p) => p === "Admin"
  );

  const limitedTeam = isPersonalOrDefault(teamModel.data?.team.name);

  return (
    <div>
      <BackLinkBar />
      <div className="page-title mb-3">
        <h1>{teamModel.data?.team.name}</h1>
      </div>
      <div className="page-info mb-3">
        <p>{teamModel.data?.team.description}</p>
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
        <Link to={`/teams/${id}/admins`} className="btn btn-new me-3">
          <FontAwesomeIcon icon={faUserTie} />
          View Team Admins
        </Link>
        {!limitedTeam && isTeamAdmin && (
          <>
            <Link to={`/teams/${id}/create`} className="btn btn-new me-3">
              <FontAwesomeIcon icon={faPlus} />
              Create New Folder
            </Link>
            <Link to={`/teams/${id}/edit`} className="btn btn-new me-3">
              <FontAwesomeIcon icon={faPencil} />
              Edit Team (TODO)
            </Link>
            <Link to={`/teams/${id}/permissions`} className="btn btn-new me-3">
              <FontAwesomeIcon icon={faUsers} />
              Manage Team Users
            </Link>
            <DeleteTeam teamId={id} />
          </>
        )}

        {!limitedTeam && (
          <LeaveTeam
            teamId={id}
            myPermissions={teamModel.data?.team.myTeamPermissions || []}
          />
        )}
      </div>
      <div className="mb-3">
        <FolderList teamModel={teamModel.data} filter={search} />
      </div>
    </div>
  );
};

export default Team;
