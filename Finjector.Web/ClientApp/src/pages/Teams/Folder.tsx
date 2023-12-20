import React, { useMemo } from "react";
import { SearchBar } from "../../components/Shared/SearchBar";
import { Link, useParams } from "react-router-dom";
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

  if (folderModel.data === undefined) {
    return <div>Folder not found</div>;
  }

  return (
    <div>
      <div className="page-title pb-2 mb-3 d-flex justify-content-between align-items-center">
        <div>
          <h1>{folderModel.data?.folder.name}</h1>
          <h4>{folderModel.data?.folder.teamName}</h4>
        </div>
        <div className="col-md-10 fin-btn-group text-end">
          <Link
            to={`/teams/${id}/folders/${folderId}/admins`}
            className="btn btn-new me-3"
          >
            <FontAwesomeIcon icon={faUserTie} />
            View Folder Admins
          </Link>
          {/* Admins can manage permissions */}
          {!limitedFolder && combinedPermissions.some((p) => p === "Admin") && (
            <>
              <Link
                to={`/teams/${id}/folders/${folderId}/permissions`}
                className="btn btn-new me-3"
              >
                <FontAwesomeIcon icon={faUsers} />
                Manage Permissions
              </Link>
              <Link
                to={`/teams/${id}/folders/${folderId}/edit`}
                className="btn btn-new me-3"
              >
                <FontAwesomeIcon icon={faPencil} />
                Edit Folder
              </Link>
              {folderId && <DeleteFolder folderId={folderId} />}
            </>
          )}
          {/* Editors & above can create new chart strings */}
          {combinedPermissions.some((p) => p === "Admin" || p === "Edit") && (
            <Link
              to={`/entry?folderId=${folderModel.data?.folder.id}`}
              className="btn btn-new"
            >
              <FontAwesomeIcon icon={faPlus} />
              Create New Chart String In {folderModel.data?.folder.name}
            </Link>
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
