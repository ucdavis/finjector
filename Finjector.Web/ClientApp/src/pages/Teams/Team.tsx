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
import PageTitle from "../../components/Shared/StyledComponents/PageTitle";
import PageBody from "../../components/Shared/StyledComponents/PageBody";
import PageInfo from "../../components/Shared/StyledComponents/PageInfo";
import FinjectorButtonDropdown from "../../components/Shared/FinjectorButtonDropdown";
import FinjectorButtonDropdownItem from "../../components/Shared/FinjectorButtonDropdownItem";

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
      <PageTitle>
        <div className="col-12 col-md-4">
          <h1>{teamModel.data?.team.name}</h1>
        </div>
        <div className="col-12 col-md-8 text-end">
          <FinjectorButtonDropdown title="Example title if you want it">
            {/* don't show team admins if you are an admin or if it's a personal team */}
            {limitedTeam ||
              (!isTeamAdmin && (
                <FinjectorButtonDropdownItem>
                  <FinjectorButton to={`/teams/${teamId}/admins`}>
                    <FontAwesomeIcon icon={faUserTie} />
                    View Team Admins
                  </FinjectorButton>
                </FinjectorButtonDropdownItem>
              ))}
            {!limitedTeam && isTeamAdmin && (
              <>
                <FinjectorButtonDropdownItem disabled={true}>
                  <FinjectorButton to={`/teams/${teamId}/folders/create`}>
                    <FontAwesomeIcon icon={faPlus} />
                    Create New Folder
                  </FinjectorButton>
                </FinjectorButtonDropdownItem>
                <FinjectorButtonDropdownItem
                  divider={true}
                ></FinjectorButtonDropdownItem>
                <FinjectorButtonDropdownItem header={true}>
                  You can also do a title like this. any props you want to add
                  work
                </FinjectorButtonDropdownItem>
                <FinjectorButtonDropdownItem>
                  <FinjectorButton to={`/teams/${teamId}/edit`}>
                    <FontAwesomeIcon icon={faPencil} />
                    Edit Team
                  </FinjectorButton>
                </FinjectorButtonDropdownItem>
                <FinjectorButtonDropdownItem>
                  <FinjectorButton to={`/teams/${teamId}/permissions`}>
                    <FontAwesomeIcon icon={faUsers} />
                    Manage Team Users
                  </FinjectorButton>
                </FinjectorButtonDropdownItem>
                <FinjectorButtonDropdownItem>
                  <DeleteTeam teamId={teamId} />
                </FinjectorButtonDropdownItem>
              </>
            )}

            {!limitedTeam && (
              <FinjectorButtonDropdownItem>
                <LeaveTeam
                  teamId={teamId}
                  myPermissions={teamModel.data?.team.myTeamPermissions || []}
                />
              </FinjectorButtonDropdownItem>
            )}
          </FinjectorButtonDropdown>
        </div>
      </PageTitle>
      <PageInfo>{teamModel.data?.team.description}</PageInfo>
      <PageBody>
        <SearchBar
          placeholderText={
            !!teamModel.data?.team.name
              ? `Search Within ${teamModel.data?.team.name}`
              : "Search My Teams"
          }
          search={search}
          setSearch={setSearch}
        />
        <FolderList teamModel={teamModel.data} filter={search} />
      </PageBody>
    </div>
  );
};

export default Team;
