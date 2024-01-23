import React, { useMemo } from "react";
import { SearchBar } from "../../components/Shared/SearchBar";
import { useParams } from "react-router-dom";
import { useGetFolder } from "../../queries/folderQueries";
import FinLoader from "../../components/Shared/FinLoader";
import { isPersonalOrDefault } from "../../util/teamDefinitions";
import ChartListSimple from "../../components/Shared/ChartListSimple";
import DeleteFolderModal from "../../components/Folders/DeleteFolderModal";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserTie,
  faPlus,
  faUsers,
  faPencil,
  faTrash,
  faPersonThroughWindow,
} from "@fortawesome/free-solid-svg-icons";
import FinjectorButton from "../../components/Shared/FinjectorButton";
import LeaveFolderModal from "../../components/Folders/LeaveFolderModal";
import PageTitle from "../../components/Shared/StyledComponents/PageTitle";
import PageBody from "../../components/Shared/StyledComponents/PageBody";
import PageInfo from "../../components/Shared/StyledComponents/PageInfo";
import FinjectorButtonDropdown from "../../components/Shared/FinjectorButtonDropdown";
import FinjectorButtonDropdownItem from "../../components/Shared/FinjectorButtonDropdownItem";

// show folder info w/ charts
const Folder: React.FC = () => {
  const { teamId = "", folderId = "" } = useParams<{
    teamId: string;
    folderId: string;
  }>();

  const [search, setSearch] = React.useState("");

  const [modalOpen, setModalOpen] = React.useState("");
  const toggleModal = (modalType: string) => {
    setModalOpen(modalType);
  };

  const folderModel = useGetFolder(folderId);

  const combinedPermissions = useMemo(() => {
    // join together folder and team permissions
    const combined = [
      ...(folderModel.data?.folder?.myFolderPermissions ?? []),
      ...(folderModel.data?.folder?.myTeamPermissions ?? []),
    ];

    return combined;
  }, [
    folderModel.data?.folder?.myFolderPermissions,
    folderModel.data?.folder?.myTeamPermissions,
  ]);

  if (folderModel.data === undefined || !folderModel.data.folder) {
    return <div>Folder not found</div>;
  }

  if (folderModel.isLoading) {
    return <FinLoader />;
  }

  const isFolderAdmin = folderModel.data?.folder.myFolderPermissions.some(
    (p) => p === "Admin"
  );
  const isTeamAdmin = folderModel.data?.folder.myTeamPermissions.some(
    (p) => p === "Admin"
  );

  const limitedFolder = isPersonalOrDefault(folderModel.data?.folder.name);

  return (
    <div>
      <PageTitle>
        <div className="col-12 col-md-9">
          <h4>{folderModel.data?.folder.teamName}</h4>
          <h1>{folderModel.data?.folder.name}</h1>
        </div>
        <div className="col-12 col-md-3 text-end">
          <FinjectorButtonDropdown shouldRenderAsDropdown={!limitedFolder}>
            {/* Editors & above can create new chart strings */}

            {combinedPermissions.some((p) => p === "Admin" || p === "Edit") && (
              <FinjectorButtonDropdownItem>
                <FinjectorButton
                  borderless={true}
                  to={`/teams/${teamId}/folders/${folderModel.data?.folder.id}/entry`}
                >
                  <FontAwesomeIcon icon={faPlus} />
                  New Chart String Here
                </FinjectorButton>
              </FinjectorButtonDropdownItem>
            )}
            {/* don't show team admins if you are an admin or if it's a personal team */}
            {limitedFolder ||
              (!isFolderAdmin && !isTeamAdmin && (
                <FinjectorButtonDropdownItem>
                  <FinjectorButton
                    borderless={true}
                    to={`/teams/${teamId}/folders/${folderId}/admins`}
                  >
                    <FontAwesomeIcon icon={faUserTie} />
                    View Folder Admins
                  </FinjectorButton>
                </FinjectorButtonDropdownItem>
              ))}

            {/* Admins can manage permissions */}
            {!limitedFolder && (isFolderAdmin || isTeamAdmin) && (
              <>
                <FinjectorButtonDropdownItem>
                  <FinjectorButton
                    borderless={true}
                    to={`/teams/${teamId}/folders/${folderId}/permissions`}
                  >
                    <FontAwesomeIcon icon={faUsers} />
                    Manage Permissions
                  </FinjectorButton>
                </FinjectorButtonDropdownItem>
                <FinjectorButtonDropdownItem>
                  <FinjectorButton
                    borderless={true}
                    to={`/teams/${teamId}/folders/${folderId}/edit`}
                  >
                    <FontAwesomeIcon icon={faPencil} />
                    Edit Folder
                  </FinjectorButton>
                </FinjectorButtonDropdownItem>

                {!!folderId && (
                  <FinjectorButtonDropdownItem>
                    <FinjectorButton
                      onClick={() => toggleModal("delete")}
                      borderless={true}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                      Delete Folder
                    </FinjectorButton>
                  </FinjectorButtonDropdownItem>
                )}
              </>
            )}
            {!limitedFolder && !isTeamAdmin && (
              <FinjectorButtonDropdownItem>
                <FinjectorButton
                  onClick={() => toggleModal("leave")}
                  borderless={true}
                >
                  <FontAwesomeIcon icon={faPersonThroughWindow} />
                  Leave Folder
                </FinjectorButton>
              </FinjectorButtonDropdownItem>
            )}
          </FinjectorButtonDropdown>
        </div>
      </PageTitle>
      <PageInfo>{folderModel.data?.folder.description}</PageInfo>
      <PageBody>
        {!limitedFolder &&
          (isFolderAdmin || isTeamAdmin) &&
          !!folderId && ( // can't be modalOpen === "delete" or we lose the modal close animation
            <DeleteFolderModal
              teamId={teamId}
              folderId={folderId}
              isOpen={modalOpen === "delete"}
              closeModal={() => toggleModal("")}
            />
          )}
        {!limitedFolder && !isTeamAdmin && (
          <LeaveFolderModal
            teamId={teamId}
            folderId={folderId}
            isOpen={modalOpen === "leave"}
            closeModal={() => toggleModal("")}
          />
        )}
        <SearchBar
          placeholderText="Search Within Folder"
          search={search}
          setSearch={setSearch}
        />
        <ChartListSimple
          charts={folderModel.data.charts}
          folder={folderModel.data.folder}
          filter={search}
        />
      </PageBody>
    </div>
  );
};

export default Folder;
