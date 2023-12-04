import React from "react";
import { useParams } from "react-router-dom";
import { usePermissionsQuery } from "../../queries/userQueries";
import { AddUserPermission } from "../../components/Teams/AddUserPermission";
import { CollectionResourceType } from "../../types";
import { RemoveUserPermission } from "../../components/Teams/RemoveUserPermissions";
import { BackLinkBar } from "../../components/Shared/BackLinkBar";
import FinjectorButton from "../../components/Shared/FinjectorButton";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const UserManagement: React.FC = () => {
  // read (team) id and folderId from the url
  const { id, folderId } = useParams();

  const resourceId = folderId ? folderId : id ? id : "";
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
        <BackLinkBar />
        <div className="page-title mb-3">
          <h1>Manage Permissions for x y z</h1>
        </div>
        {errorContent}
      </div>
    );
  }

  return (
    <div>
      <BackLinkBar />
      <div className="page-title mb-3">
        <h1>Manage Permissions for x y z</h1>
      </div>
      <FinjectorButton className="mb-3" onClick={toggleAddPermission}>
        <FontAwesomeIcon icon={faPlus} />
        Add New Role
      </FinjectorButton>
      <table className="table">
        <thead>
          <tr>
            <th>User Name</th>
            <th>User Email</th>
            <th>Role Name</th>
            <th>Remove Role</th>
          </tr>
        </thead>
        <tbody>
          {membershipQuery.data &&
            membershipQuery.data.map((member) => (
              <tr key={member.userEmail}>
                <td>{member.userName}</td>
                <td>{member.userEmail}</td>
                <td>{member.roleName}</td>
                <td>
                  <RemoveUserPermission
                    resourceId={resourceId}
                    resourceType={resourceType}
                    userEmail={member.userEmail}
                  />
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
