import React from "react";
import { RemoveUserPermission } from "./RemoveUserPermissions";
import {
  CollectionResourceType,
  FinQueryStatus,
  PermissionsResponseModel,
} from "../../types";
import { useFinQueryStatusHandler } from "../../util/error";

interface UserPermissionTableProps {
  membershipQueryData: PermissionsResponseModel[] | undefined;
  resourceType: CollectionResourceType;
  resourceId: string;
  queryStatus: FinQueryStatus;
}

const UserPermissionTable: React.FC<UserPermissionTableProps> = ({
  membershipQueryData,
  resourceType,
  resourceId,
  queryStatus,
}) => {
  const queryStatusComponent = useFinQueryStatusHandler({
    queryStatus,
  });

  if (queryStatusComponent) return <>{queryStatusComponent}</>;

  return (
    <div
      className="table-responsive"
      role="region"
      aria-label="User permissions"
      tabIndex={0}
    >
      <table className="table">
        <caption className="visually-hidden">User permissions</caption>
        <thead>
          <tr>
            <th scope="col">User Name</th>
            <th scope="col">User Email</th>
            <th scope="col">Level</th>
            <th scope="col">Role Name</th>
            <th scope="col">Remove Role</th>
          </tr>
        </thead>
        <tbody>
          {membershipQueryData &&
            membershipQueryData.map((member) => (
              <tr key={`${member.userEmail}-${member.level}`}>
                <td>{member.userName}</td>
                <td>{member.userEmail}</td>
                <td>{member.level}</td>
                <td>{member.roleName}</td>
                <td>
                  {resourceType === member.level && (
                    <RemoveUserPermission
                      key={`${member.userName}-${member.level}`}
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
    </div>
  );
};

export default UserPermissionTable;
