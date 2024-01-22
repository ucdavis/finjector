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
      <PageTitle>
        <div className="col-12 col-md-9">
          <h4>{folderModel.data?.folder.teamName}</h4>
          <h1>{folderModel.data?.folder.name}</h1>
        </div>
        <div className="col-12 col-md-3 text-end">
          <FinjectorButtonDropdown>
            {/* Editors & above can create new chart strings */}

            {combinedPermissions.some((p) => p === "Admin" || p === "Edit") && (
              <FinjectorButtonDropdownItem>
                <FinjectorButton
                  className="btn-borderless"
                  to={`/teams/${teamId}/folders/${folderModel.data?.folder.id}/entry`}
                >
                  <FontAwesomeIcon icon={faPlus} />
                  New Chart String Here
                </FinjectorButton>
              </FinjectorButtonDropdownItem>
            )}
            {/* don't show team admins if you are an admin or if it's a personal team */}
            {limitedFolder ||
              (!isFolderAdmin && (
                <FinjectorButtonDropdownItem>
                  <FinjectorButton
                    className="btn-borderless"
                    to={`/teams/${teamId}/folders/${folderId}/admins`}
                  >
                    <FontAwesomeIcon icon={faUserTie} />
                    View Folder Admins
                  </FinjectorButton>
                </FinjectorButtonDropdownItem>
              ))}

            {/* Admins can manage permissions */}
            {!limitedFolder && combinedPermissions.some((p) => p === "Admin") && (
              <>
                <FinjectorButtonDropdownItem>
                  <FinjectorButton
                    className="btn-borderless"
                    to={`/teams/${teamId}/folders/${folderId}/permissions`}
                  >
                    <FontAwesomeIcon icon={faUsers} />
                    Manage Permissions
                  </FinjectorButton>
                </FinjectorButtonDropdownItem>
                <FinjectorButtonDropdownItem>
                  <FinjectorButton
                    className="btn-borderless"
                    to={`/teams/${teamId}/folders/${folderId}/edit`}
                  >
                    <FontAwesomeIcon icon={faPencil} />
                    Edit Folder
                  </FinjectorButton>
                </FinjectorButtonDropdownItem>

                {folderId && (
                  <FinjectorButtonDropdownItem>
                    <DeleteFolder folderId={folderId} />
                  </FinjectorButtonDropdownItem>
                )}
              </>
            )}
            {!limitedFolder && (
              <FinjectorButtonDropdownItem>
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
              </FinjectorButtonDropdownItem>
            )}
          </FinjectorButtonDropdown>
        </div>
      </PageTitle>
      <PageInfo>{folderModel.data?.folder.description}</PageInfo>
      <PageBody>
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
