import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import FinButton from "../Shared/FinButton";
import PageTitle from "../Shared/Layout/PageTitle";
import { AddUserPermission } from "./AddUserPermission";
import {
  CollectionResourceType,
  FinQueryStatus,
  PermissionsResponseModel,
} from "../../types";

interface UserPermissionTitleProps {
  membershipQueryData: PermissionsResponseModel[] | undefined;
  resourceId: string;
  resourceType: CollectionResourceType;
  folderId: string | undefined;
  queryStatus: FinQueryStatus;
}

const UserPermissionTitle: React.FC<UserPermissionTitleProps> = ({
  membershipQueryData,
  resourceId,
  resourceType,
  folderId,
  queryStatus,
}) => {
  const [addPermissionActive, setAddPermissionActive] = React.useState(false);

  const toggleAddPermission = () => setAddPermissionActive((p) => !p);

  if (queryStatus.isLoading || queryStatus.isError || !membershipQueryData)
    return (
      <PageTitle>
        <div className="col-12 col-md-3">
          <h4>
            {queryStatus.isLoading
              ? "Scribbling in Permissions..."
              : "Error loading Permissions"}
          </h4>
          <h1>Manage {folderId ? "Folder" : "Team"} Permissions</h1>
        </div>
      </PageTitle>
    );
  const resourceName =
    membershipQueryData.length > 0 ? membershipQueryData[0].resourceName : "";

  return (
    <>
      <PageTitle>
        <div className="col-12 col-md-3">
          <h4>{resourceName}</h4>
          <h1>Manage {folderId ? "Folder" : "Team"} Permissions</h1>
        </div>

        <div className="col-9 col-md-9 text-end">
          <FinButton onClick={toggleAddPermission}>
            <FontAwesomeIcon icon={faPlus} />
            Add New Role
          </FinButton>
        </div>
      </PageTitle>
      <AddUserPermission
        resourceId={resourceId}
        resourceType={resourceType}
        active={addPermissionActive}
        toggle={toggleAddPermission}
      />
    </>
  );
};

export default UserPermissionTitle;
