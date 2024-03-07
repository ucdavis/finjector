import React from 'react';

import {
  CollectionResourceType,
  FinQueryStatus,
  PermissionsResponseModel,
} from '../../types';
import { useFinQueryStatusHandler } from '../../util/error';

import { RemoveUserPermission } from './RemoveUserPermissions';

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
    <table className='table'>
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
  );
};

export default UserPermissionTable;
