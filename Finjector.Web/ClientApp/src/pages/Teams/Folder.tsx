import React, { useMemo } from "react";
import { SearchBar } from "../../components/Shared/SearchBar";
import { useParams } from "react-router-dom";
import { useGetFolder } from "../../queries/folderQueries";
import FinLoader from "../../components/Shared/LoadingAndErrors/FinLoader";
import { isPersonalOrDefault } from "../../util/teamDefinitions";
import ChartListSimple from "../../components/Folders/ChartListSimple";
import DeleteFolderModal from "../../components/Folders/DeleteFolderModal";
import LeaveFolderModal from "../../components/Folders/LeaveFolderModal";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserTie,
  faPlus,
  faUsers,
  faPencil,
  faTrash,
  faPersonThroughWindow,
} from "@fortawesome/free-solid-svg-icons";
import FinButton from "../../components/Shared/FinButton";
import PageTitle from "../../components/Shared/Layout/PageTitle";
import PageBody from "../../components/Shared/Layout/PageBody";
import PageInfo from "../../components/Shared/Layout/PageInfo";
import FinButtonDropdown from "../../components/Shared/FinButtonDropdown";
import FinButtonDropdownItem from "../../components/Shared/FinButtonDropdownItem";
import DownloadChartStringsButton from "./DownloadChartStringsButton";

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

  if (folderModel.isLoading) {
    return <FinLoader />;
  }

  if (folderModel.data === undefined || !folderModel.data.folder) {
    return <div>Folder not found</div>;
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
          <FinButtonDropdown>
            {/* Editors & above can create new chart strings */}
            {combinedPermissions.some((p) => p === "Admin" || p === "Edit") && (
              <FinButtonDropdownItem>
                <FinButton
                  borderless={true}
                  to={`/teams/${teamId}/folders/${folderModel.data?.folder.id}/entry`}
                >
                  <FontAwesomeIcon icon={faPlus} />
                  New Chart String Here
                </FinButton>
              </FinButtonDropdownItem>
            )}
            {/* don't show team admins if you are an admin or if it's a personal team */}
            {limitedFolder ||
              (!isFolderAdmin && !isTeamAdmin && (
                <FinButtonDropdownItem>
                  <FinButton
                    borderless={true}
                    to={`/teams/${teamId}/folders/${folderId}/admins`}
                  >
                    <FontAwesomeIcon icon={faUserTie} />
                    View Folder Admins
                  </FinButton>
                </FinButtonDropdownItem>
              ))}

            {/* Admins can manage permissions */}
            {!limitedFolder && (isFolderAdmin || isTeamAdmin) && (
              <>
                <FinButtonDropdownItem>
                  <FinButton
                    borderless={true}
                    to={`/teams/${teamId}/folders/${folderId}/permissions`}
                  >
                    <FontAwesomeIcon icon={faUsers} />
                    Manage Permissions
                  </FinButton>
                </FinButtonDropdownItem>
                <FinButtonDropdownItem>
                  <FinButton
                    borderless={true}
                    to={`/teams/${teamId}/folders/${folderId}/edit`}
                  >
                    <FontAwesomeIcon icon={faPencil} />
                    Edit Folder
                  </FinButton>
                </FinButtonDropdownItem>

                {!!folderId && (
                  <FinButtonDropdownItem>
                    <FinButton
                      onClick={() => toggleModal("delete")}
                      borderless={true}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                      Delete Folder
                    </FinButton>
                  </FinButtonDropdownItem>
                )}
              </>
            )}
            {!limitedFolder && !isTeamAdmin && (
              <FinButtonDropdownItem>
                <FinButton
                  onClick={() => toggleModal("leave")}
                  borderless={true}
                >
                  <FontAwesomeIcon icon={faPersonThroughWindow} />
                  Leave Folder
                </FinButton>
              </FinButtonDropdownItem>
            )}
            {/* Anyone can export their chart string */}
            <FinButtonDropdownItem>
              <DownloadChartStringsButton
                charts={folderModel.data.charts}
                fileName={`${folderModel.data.folder.name.replace(
                  / /g,
                  "-"
                )}_finjector_export`}
                fileType="CSV"
                borderless={true}
                id="download-chart-btn"
              ></DownloadChartStringsButton>
            </FinButtonDropdownItem>
          </FinButtonDropdown>
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
