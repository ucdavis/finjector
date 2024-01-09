import React, { useMemo } from "react";
import { SearchBar } from "../../components/Shared/SearchBar";
import { useParams } from "react-router-dom";
import { useGetFolder } from "../../queries/folderQueries";
import FinLoader from "../../components/Shared/FinLoader";
import { isPersonalOrDefault } from "../../util/teamDefinitions";
import ChartListSimple from "../../components/Shared/ChartListSimple";
import DeleteFolder from "../../components/Folders/DeleteFolder";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserTie,
  faPlus,
  faUsers,
  faPencil,
} from "@fortawesome/free-solid-svg-icons";
import FinjectorButton from "../../components/Shared/FinjectorButton";
import LeaveFolder from "../../components/Folders/LeaveFolder";

// show folder info w/ charts
const Folder: React.FC = () => {
  const { teamId = "", folderId = "" } = useParams<{
    teamId: string;
    folderId: string;
  }>();

  const [search, setSearch] = React.useState("");

  const folderModel = useGetFolder(folderId);

  const combinedPermissions = useMemo(() => {
    // join together folder and team permissions
    const combined = [
      ...(folderModel.data?.folder.myFolderPermissions ?? []),
      ...(folderModel.data?.folder.myTeamPermissions ?? []),
    ];

    return combined;
  }, [
    folderModel.data?.folder.myFolderPermissions,
    folderModel.data?.folder.myTeamPermissions,
  ]);

  if (folderModel.isLoading) {
    return <FinLoader />;
  }

  const isFolderAdmin =
    folderModel.data?.folder.myFolderPermissions.some((p) => p === "Admin") ||
    folderModel.data?.folder.myTeamPermissions.some((p) => p === "Admin");

  const limitedFolder = isPersonalOrDefault(folderModel.data?.folder.name);

  if (folderModel.data === undefined) {
    return <div>Folder not found</div>;
  }

  return (
    <div>
      <div className="page-title pb-2 mb-3 row justify-content-between align-items-center">
        <div className="col-12 col-md-4">
          <h4>{folderModel.data?.folder.teamName}</h4>
          <h1>{folderModel.data?.folder.name}</h1>
        </div>
        <div className="col-12 col-md-8 text-end">
          {/* Editors & above can create new chart strings */}
          {combinedPermissions.some((p) => p === "Admin" || p === "Edit") && (
            <FinjectorButton
              to={`/entry?folderId=${folderModel.data?.folder.id}`}
            >
              <FontAwesomeIcon icon={faPlus} />
              New Chart String Here
            </FinjectorButton>
          )}
          {/* don't show team admins if you are an admin or if it's a personal team */}
          {limitedFolder ||
            (!isFolderAdmin && (
              <FinjectorButton
                to={`/teams/${teamId}/folders/${folderId}/admins`}
              >
                <FontAwesomeIcon icon={faUserTie} />
                View Folder Admins
              </FinjectorButton>
            ))}

          {/* Admins can manage permissions */}
          {!limitedFolder && combinedPermissions.some((p) => p === "Admin") && (
            <>
              <FinjectorButton
                to={`/teams/${teamId}/folders/${folderId}/permissions`}
              >
                <FontAwesomeIcon icon={faUsers} />
                Manage Permissions
              </FinjectorButton>
              <FinjectorButton to={`/teams/${teamId}/folders/${folderId}/edit`}>
                <FontAwesomeIcon icon={faPencil} />
                Edit Folder
              </FinjectorButton>
              {folderId && <DeleteFolder folderId={folderId} />}
            </>
          )}
          {!limitedFolder && (
            <LeaveFolder
              teamId={teamId}
              folderId={folderId}
              myFolderPermissions={
                folderModel.data?.folder.myFolderPermissions || []
              }
              myTeamPermissions={
                folderModel.data?.folder.myTeamPermissions || []
              }
            />
          )}
        </div>
      </div>
      <div className="page-info mb-3">
        <p>{folderModel.data?.folder.description}</p>
      </div>
      <div className="mb-3">
        <SearchBar
          placeholderText="Search Within Folder"
          search={search}
          setSearch={setSearch}
        />
      </div>

      <ChartListSimple
        charts={folderModel.data.charts}
        folder={folderModel.data.folder}
        filter={search}
      />
    </div>
  );
};

export default Folder;
