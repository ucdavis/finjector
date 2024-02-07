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

interface FolderTitleProps {
  folderModelData: FolderResponseModel | undefined;
  queryStatus: FinQueryStatus;
  isFolderAdmin: boolean | undefined;
  isTeamAdmin: boolean | undefined;
  limitedFolder: boolean | undefined;
  teamId: string;
  folderId: string;
  toggleModal: (modalType: string) => void;
}

const FolderTitle: React.FC<FolderTitleProps> = ({
  folderModelData,
  queryStatus,
  isFolderAdmin,
  isTeamAdmin,
  limitedFolder,
  teamId,
  folderId,
  toggleModal,
}) => {
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

  if (queryStatus.isInitialLoading) {
    return (
      <PageTitle>
        <div className="col-12 col-md-9">
          <h4>Team</h4>
          <h1>Scribbling in Folder...</h1>
        </div>
      </PageTitle>
    );
  }

  if (queryStatus.isError) {
    return (
      <PageTitle>
        <div className="col-12 col-md-9">
          <h4>Team</h4>
          <h1>Scribbling in Folder...</h1>
        </div>
      </PageTitle>
    );
  }

  // if data has loaded without error, but we still don't have folder data
  if (!folderModelData) {
    return null;
  }

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
    </>
  );
};

export default FolderTitle;
