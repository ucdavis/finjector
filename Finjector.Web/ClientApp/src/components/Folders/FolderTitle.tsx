import React, { useMemo } from "react";
import { FinQueryStatus, FolderResponseModel } from "../../types";
import {
  faPlus,
  faUserTie,
  faUsers,
  faPencil,
  faTrash,
  faPersonThroughWindow,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DownloadChartStringsButton from "../../pages/Teams/DownloadChartStringsButton";
import FinButton from "../Shared/FinButton";
import FinButtonDropdown from "../Shared/FinButtonDropdown";
import FinButtonDropdownItem from "../Shared/FinButtonDropdownItem";
import PageInfo from "../Shared/Layout/PageInfo";
import PageTitle from "../Shared/Layout/PageTitle";
import LeaveFolderModal from "./LeaveFolderModal";
import DeleteFolderModal from "./DeleteFolderModal";
import { isPersonalOrDefault } from "../../util/teamDefinitions";

interface FolderTitleProps {
  folderModelData: FolderResponseModel | undefined;
  queryStatus: FinQueryStatus;
  teamId: string;
  folderId: string;
}

const FolderTitle: React.FC<FolderTitleProps> = ({
  folderModelData,
  queryStatus,
  teamId,
  folderId,
}) => {
  const [modalOpen, setModalOpen] = React.useState("");
  const toggleModal = (modalType: string) => {
    setModalOpen(modalType);
  };

  const combinedPermissions = useMemo(() => {
    // join together folder and team permissions
    const combined = [
      ...(folderModelData?.folder?.myFolderPermissions ?? []),
      ...(folderModelData?.folder?.myTeamPermissions ?? []),
    ];

    return combined;
  }, [
    folderModelData?.folder?.myFolderPermissions,
    folderModelData?.folder?.myTeamPermissions,
  ]);

  if (queryStatus.isLoading || queryStatus.isError || !folderModelData) {
    return (
      <PageTitle>
        <div className="col-12 col-md-9">
          <h4>
            {queryStatus.isLoading
              ? "Scribbling in Folder Details..."
              : "Error loading Folder Details"}
          </h4>
          <h1>Folder Details</h1>
        </div>
        <div className="col-12 col-md-3 text-end">
          <FinButtonDropdown disabled={true}></FinButtonDropdown>
        </div>
      </PageTitle>
    );
  }

  const isFolderAdmin = folderModelData.folder.myFolderPermissions.some(
    (p) => p === "Admin"
  );
  const isTeamAdmin = folderModelData.folder.myTeamPermissions.some(
    (p) => p === "Admin"
  );

  const limitedFolder = isPersonalOrDefault(folderModelData.folder.name);

  return (
    <>
      <PageTitle>
        <div className="col-12 col-md-9">
          <h4>{folderModelData.folder.teamName}</h4>
          <h1>{folderModelData.folder.name}</h1>
        </div>
        <div className="col-12 col-md-3 text-end">
          <FinButtonDropdown>
            {/* Editors & above can create new chart strings */}
            {combinedPermissions.some((p) => p === "Admin" || p === "Edit") && (
              <FinButtonDropdownItem>
                <FinButton
                  borderless={true}
                  to={`/teams/${teamId}/folders/${folderModelData.folder.id}/entry`}
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
                charts={folderModelData.charts}
                fileName={`${folderModelData.folder.name.replace(
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
      <PageInfo>{folderModelData.folder.description}</PageInfo>
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
    </>
  );
};

export default FolderTitle;
