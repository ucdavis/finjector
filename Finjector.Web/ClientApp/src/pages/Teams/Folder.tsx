import React, { useMemo } from "react";
import { SearchBar } from "../../components/Shared/SearchBar";
import { Link, useParams } from "react-router-dom";
import { useGetFolder } from "../../queries/folderQueries";
import ChartList from "../../components/Shared/ChartList";
import { BackLinkBar } from "../../components/Shared/BackLinkBar";
import FinLoader from "../../components/Shared/FinLoader";
import { isPersonalOrDefault } from "../../util/teamDefinitions";

// show folder info w/ charts
const Folder: React.FC = () => {
  const { id, folderId } = useParams<{ id: string; folderId: string }>();

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

  const limitedFolder = isPersonalOrDefault(folderModel.data?.folder.name);

  return (
    <div>
      <BackLinkBar />
      <div className="page-title">
        <h1>{folderModel.data?.folder.name}</h1>
      </div>
      <div className="page-info mb-3">
        <p>Team - {folderModel.data?.folder.teamName}</p>
        <Link
          to={`/teams/${id}/folders/${folderId}/admins`}
          className="btn btn-link"
        >
          View Folder Admins
        </Link>
      </div>
      <div className="mb-3">
        <SearchBar
          placeholderText="Search Within Folder"
          search={search}
          setSearch={setSearch}
        />
      </div>
      {/* Admins can manage permissions */}
      {!limitedFolder && combinedPermissions.some((p) => p === "Admin") && (
        <>
          <Link
            to={`/teams/${id}/folders/${folderId}/permissions`}
            className="btn btn-new me-3"
          >
            Manage Permissions
          </Link>
          <Link
            to={`/teams/${id}/folders/${folderId}/edit`}
            className="btn btn-new me-3"
          >
            Edit Folder (TODO)
          </Link>
        </>
      )}
      {/* Editors & above can create new chart strings */}
      {combinedPermissions.some((p) => p === "Admin" || p === "Edit") && (
        <Link
          to={`/entry?folderId=${folderModel.data?.folder.id}`}
          className="btn btn-new me-3"
        >
          Create New Chart String In {folderModel.data?.folder.name}
        </Link>
      )}

      <ChartList charts={folderModel.data?.charts} filter={search} />
    </div>
  );
};

export default Folder;
