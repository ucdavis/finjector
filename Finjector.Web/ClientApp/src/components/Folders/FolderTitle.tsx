import React, { useMemo } from "react";
import { Coa, FinQueryStatus, FolderResponseModel } from "../../types";
import {
  faPlus,
  faUserTie,
  faUsers,
  faPencil,
  faTrash,
  faPersonThroughWindow,
  faRotateLeft,
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

interface FolderTitleProps {
  folderModelData: FolderResponseModel | undefined;
  queryStatus: FinQueryStatus;
  teamId: string;
  folderId: string;
  selectedCharts?: Coa[];
  recentlyDeletedChartCount?: number;
  selectedActionPending?: boolean;
  undoDeletePending?: boolean;
  onDeleteSelectedCharts?: () => void;
  onUndoDeleteCharts?: () => void;
  onSelectedChartsExported?: () => void;
}

const FolderTitle: React.FC<FolderTitleProps> = ({
  folderModelData,
  queryStatus,
  teamId,
  folderId,
  selectedCharts = [],
  recentlyDeletedChartCount = 0,
  selectedActionPending = false,
  undoDeletePending = false,
  onDeleteSelectedCharts,
  onUndoDeleteCharts,
  onSelectedChartsExported,
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
    (p) => p === "Admin",
  );
  const isTeamAdmin = folderModelData.folder.myTeamPermissions.some(
    (p) => p === "Admin",
  );

  const limitedFolder = folderModelData.folder.isDefault;
  const selectedChartCount = selectedCharts.length;
  const selectedChartLabel =
    selectedChartCount === 1 ? "Chart String" : "Chart Strings";
  const deletedChartLabel =
    recentlyDeletedChartCount === 1 ? "Chart String" : "Chart Strings";
  const exportFileName = `${folderModelData.folder.name.replace(
    / /g,
    "-",
  )}_finjector_export`;
  const selectedExportFileName = `${folderModelData.folder.name.replace(
    / /g,
    "-",
  )}_selected_finjector_export`;

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
            {selectedChartCount > 0 && (
              <>
                <FinButtonDropdownItem>
                  <DownloadChartStringsButton
                    charts={selectedCharts}
                    fileName={selectedExportFileName}
                    fileType="CSV"
                    borderless={true}
                    id="download-selected-chart-btn"
                    onDownloaded={onSelectedChartsExported}
                  >
                    Export {selectedChartCount} Selected {selectedChartLabel}{" "}
                    (CSV)
                  </DownloadChartStringsButton>
                </FinButtonDropdownItem>
                <FinButtonDropdownItem>
                  <FinButton
                    onClick={onDeleteSelectedCharts}
                    borderless={true}
                    disabled={selectedActionPending}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                    Delete {selectedChartCount} {selectedChartLabel}
                  </FinButton>
                </FinButtonDropdownItem>
              </>
            )}
            {recentlyDeletedChartCount > 0 && (
              <FinButtonDropdownItem>
                <FinButton
                  onClick={onUndoDeleteCharts}
                  borderless={true}
                  disabled={undoDeletePending}
                >
                  <FontAwesomeIcon icon={faRotateLeft} />
                  Undo Delete {recentlyDeletedChartCount} {deletedChartLabel}
                </FinButton>
              </FinButtonDropdownItem>
            )}
            {/* don't show team admins if you are an admin or if it's a personal team */}
            {!limitedFolder && !isFolderAdmin && !isTeamAdmin && (
              <FinButtonDropdownItem>
                <FinButton
                  borderless={true}
                  to={`/teams/${teamId}/folders/${folderId}/admins`}
                >
                  <FontAwesomeIcon icon={faUserTie} />
                  View Folder Admins
                </FinButton>
              </FinButtonDropdownItem>
            )}

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
                fileName={exportFileName}
                fileType="CSV"
                borderless={true}
                id="download-chart-btn"
                onDownloaded={onSelectedChartsExported}
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
