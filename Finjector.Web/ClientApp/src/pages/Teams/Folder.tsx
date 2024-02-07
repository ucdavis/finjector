import React from "react";
import { SearchBar } from "../../components/Shared/SearchBar";
import { useParams } from "react-router-dom";
import { useGetFolder } from "../../queries/folderQueries";
import { isPersonalOrDefault } from "../../util/teamDefinitions";
import ChartListSimple from "../../components/Folders/ChartListSimple";
import DeleteFolderModal from "../../components/Folders/DeleteFolderModal";
import LeaveFolderModal from "../../components/Folders/LeaveFolderModal";

import PageBody from "../../components/Shared/Layout/PageBody";
import { FinQueryStatus } from "../../types";
import FolderTitle from "../../components/Folders/FolderTitle";

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

  const folderModelQuery = useGetFolder(folderId);

  const queryStatus: FinQueryStatus = {
    isError: folderModelQuery.isError,
    isInitialLoading: folderModelQuery.isInitialLoading,
    error: folderModelQuery.error,
  };

  const isFolderAdmin = folderModelQuery.data?.folder.myFolderPermissions.some(
    (p) => p === "Admin"
  );
  const isTeamAdmin = folderModelQuery.data?.folder.myTeamPermissions.some(
    (p) => p === "Admin"
  );

  const limitedFolder = isPersonalOrDefault(folderModelQuery.data?.folder.name);

  return (
    <div>
      <FolderTitle
        folderModelData={folderModelQuery.data}
        queryStatus={queryStatus}
        isFolderAdmin={isFolderAdmin}
        isTeamAdmin={isTeamAdmin}
        limitedFolder={limitedFolder}
        teamId={teamId}
        folderId={folderId}
        toggleModal={toggleModal}
      />
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
          charts={folderModelQuery.data?.charts}
          folder={folderModelQuery.data?.folder}
          filter={search}
          queryStatus={queryStatus}
        />
      </PageBody>
    </div>
  );
};

export default Folder;
