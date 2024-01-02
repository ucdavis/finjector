import React from "react";
import { useParams } from "react-router-dom";
import { usePermissionsQuery } from "../../queries/userQueries";
import { AddUserPermission } from "../../components/Teams/AddUserPermission";
import { CollectionResourceType } from "../../types";
import { RemoveUserPermission } from "../../components/Teams/RemoveUserPermissions";
import FinjectorButton from "../../components/Shared/FinjectorButton";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const UserManagement: React.FC = () => {
  // read (team) id and folderId from the url
  const { teamId, folderId } = useParams();

  const resourceId = folderId ? folderId : teamId ? teamId : "";
  const resourceType: CollectionResourceType = folderId ? "folder" : "team";

  const [addPermissionActive, setAddPermissionActive] = React.useState(false);

  const toggleAddPermission = () => setAddPermissionActive((p) => !p);

  // query for membership
  const membershipQuery = usePermissionsQuery(resourceId, resourceType);

  if (membershipQuery.isLoading) {
    return <div>Loading...</div>;
  }

  // show error message if user is unauthorized
  if (membershipQuery.isError) {
    var err: Error = membershipQuery.error;

    var errorContent = <div>Something went wrong...</div>;

    if (err.message === "401 Unauthorized") {
      errorContent = <div>You are not authorized to view this page</div>;
    }

    return (
      <div>
        <div className="page-title mb-3">
          <h1>Manage {folderId ? "Folder" : "Team"} Permissions</h1>
        </div>
        {errorContent}
      </div>
    );
  }

  return (
    <div>
      <div className="page-title pb-2 mb-3 d-flex justify-content-between align-items-center">
        <h1>Manage {folderId ? "Folder" : "Team"} Permissions</h1>
        <div className="col-md-9 text-end">
          <FinjectorButton onClick={toggleAddPermission}>
            <FontAwesomeIcon icon={faPlus} />
            Add New Role
          </FinjectorButton>
        </div>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>User Name</th>
            <th>User Email</th>
            <th>Level</th>
            <th>Role Name</th>
            <th>Remove Role</th>
          </tr>
        </thead>
        <tbody>
          {membershipQuery.data &&
            membershipQuery.data.map((member) => (
              <tr key={`${member.userEmail}-${member.level}`}>
                <td>{member.userName}</td>
                <td>{member.userEmail}</td>
                <td>{member.level}</td>
                <td>{member.roleName}</td>
                <td>
                  {resourceType === member.level && (
                    <RemoveUserPermission
                      resourceId={resourceId}
                      resourceType={resourceType}
                      userEmail={member.userEmail}
                    />
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <AddUserPermission
        resourceId={resourceId}
        resourceType={resourceType}
        active={addPermissionActive}
        toggle={toggleAddPermission}
      />
    </div>
  );
};

export default UserManagement;
