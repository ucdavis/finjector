import React from "react";
import { SearchBar } from "../../components/Shared/SearchBar";
import { useGetTeam } from "../../queries/teamQueries";
import { useParams } from "react-router-dom";
import FolderList from "../../components/Teams/FolderList";
import FinLoader from "../../components/Shared/LoadingAndErrors/FinLoader";
import DeleteTeamModal from "../../components/Teams/DeleteTeamModal";
import LeaveTeamModal from "../../components/Teams/LeaveTeamModal";
import { isPersonalOrDefault } from "../../util/teamDefinitions";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faUsers,
  faPencil,
  faUserTie,
  faPersonThroughWindow,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import FinButton from "../../components/Shared/FinButton";
import PageTitle from "../../components/Shared/Layout/PageTitle";
import PageBody from "../../components/Shared/Layout/PageBody";
import PageInfo from "../../components/Shared/Layout/PageInfo";
import FinjectorButtonDropdown from "../../components/Shared/FinjectorButtonDropdown";
import FinjectorButtonDropdownItem from "../../components/Shared/FinjectorButtonDropdownItem";

const Team: React.FC = () => {
  // get id from url
  const { teamId = "" } = useParams<{ teamId: string }>();

  const [search, setSearch] = React.useState("");

  const [modalOpen, setModalOpen] = React.useState("");
  const toggleModal = (modalType: string) => {
    setModalOpen(modalType);
  };

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
        <div className="col-12 col-md-9">
          <h1>{teamModel.data?.team.name}</h1>
        </div>
        <div className="col-12 col-md-3 text-end">
          <FinjectorButtonDropdown shouldRenderAsDropdown={!limitedTeam}>
            {/* don't show team admins if you are an admin or if it's a personal team */}
            {limitedTeam ||
              (!isTeamAdmin && (
                <FinjectorButtonDropdownItem>
                  <FinButton borderless={true} to={`/teams/${teamId}/admins`}>
                    <FontAwesomeIcon icon={faUserTie} />
                    View Team Admins
                  </FinButton>
                </FinjectorButtonDropdownItem>
              ))}
            {!limitedTeam && isTeamAdmin && (
              <>
                <FinjectorButtonDropdownItem>
                  <FinButton
                    borderless={true}
                    to={`/teams/${teamId}/folders/create`}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                    Create New Folder
                  </FinButton>
                </FinjectorButtonDropdownItem>
                <FinjectorButtonDropdownItem>
                  <FinButton borderless={true} to={`/teams/${teamId}/edit`}>
                    <FontAwesomeIcon icon={faPencil} />
                    Edit Team
                  </FinButton>
                </FinjectorButtonDropdownItem>
                <FinjectorButtonDropdownItem>
                  <FinButton
                    borderless={true}
                    to={`/teams/${teamId}/permissions`}
                  >
                    <FontAwesomeIcon icon={faUsers} />
                    Manage Team Users
                  </FinButton>
                </FinjectorButtonDropdownItem>
                <FinjectorButtonDropdownItem>
                  <FinButton
                    borderless={true}
                    onClick={() => toggleModal("delete")}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                    Delete Team
                  </FinButton>{" "}
                </FinjectorButtonDropdownItem>
              </>
            )}

            {!limitedTeam && (
              <FinjectorButtonDropdownItem>
                <FinButton
                  borderless={true}
                  onClick={() => toggleModal("leave")}
                >
                  <FontAwesomeIcon icon={faPersonThroughWindow} />
                  Leave Team
                </FinButton>
              </FinjectorButtonDropdownItem>
            )}
          </FinjectorButtonDropdown>
        </div>
      </PageTitle>
      <PageInfo>{teamModel.data?.team.description}</PageInfo>
      <PageBody>
        {!limitedTeam && (
          <LeaveTeamModal
            teamId={teamId}
            isAdmin={isTeamAdmin !== undefined && isTeamAdmin}
            isOpen={modalOpen === "leave"}
            closeModal={() => toggleModal("")}
          />
        )}
        {!limitedTeam && isTeamAdmin && (
          <DeleteTeamModal
            teamId={teamId}
            isOpen={modalOpen === "delete"}
            closeModal={() => toggleModal("")}
          />
        )}
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
