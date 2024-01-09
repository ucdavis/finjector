import React from "react";
import { SearchBar } from "../../components/Shared/SearchBar";
import { useGetTeam } from "../../queries/teamQueries";
import { useParams } from "react-router-dom";
import FolderList from "../../components/Teams/FolderList";
import FinLoader from "../../components/Shared/FinLoader";
import DeleteTeam from "../../components/Teams/DeleteTeam";
import LeaveTeam from "../../components/Teams/LeaveTeam";
import { isPersonalOrDefault } from "../../util/teamDefinitions";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faUsers,
  faPencil,
  faUserTie,
} from "@fortawesome/free-solid-svg-icons";
import FinjectorButton from "../../components/Shared/FinjectorButton";

const Team: React.FC = () => {
  // get id from url
  const { teamId = "" } = useParams<{ teamId: string }>();

  const [search, setSearch] = React.useState("");

  const teamModel = useGetTeam(teamId);

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
      <div className="page-title pb-2 mb-3 row justify-content-between align-items-center">
        <div className="col-12 col-md-4">
          <h1>{teamModel.data?.team.name}</h1>
        </div>
        <div className="col-12 col-md-8 text-end">
          {teamModel.data?.team.isPersonal === false && (
            <FinjectorButton to={`/teams/${teamId}/admins`}>
              <FontAwesomeIcon icon={faUserTie} />
              View Team Admins
            </FinjectorButton>
          )}
          {!limitedTeam && isTeamAdmin && (
            <>
              <FinjectorButton to={`/teams/${teamId}/folders/create`}>
                <FontAwesomeIcon icon={faPlus} />
                Create New Folder
              </FinjectorButton>
              <FinjectorButton to={`/teams/${teamId}/edit`}>
                <FontAwesomeIcon icon={faPencil} />
                Edit Team
              </FinjectorButton>
              <FinjectorButton to={`/teams/${teamId}/permissions`}>
                <FontAwesomeIcon icon={faUsers} />
                Manage Team Users
              </FinjectorButton>
              <DeleteTeam teamId={teamId} />
            </>
          )}

          {!limitedTeam && (
            <LeaveTeam
              teamId={teamId}
              myPermissions={teamModel.data?.team.myTeamPermissions || []}
            />
          )}
        </div>
      </div>
      <div className="page-info mb-3">
        <p>{teamModel.data?.team.description}</p>
      </div>

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
    </div>
  );
};

export default Team;
