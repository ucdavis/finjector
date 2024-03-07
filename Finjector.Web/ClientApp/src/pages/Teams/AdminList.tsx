import React from 'react';
import { useParams } from 'react-router-dom';

import PageTitle from '../../components/Shared/Layout/PageTitle';
import { useAdminsQuery } from '../../queries/userQueries';
import { CollectionResourceType, FinQueryStatus } from '../../types';
import { useFinQueryStatus, useFinQueryStatusHandler } from '../../util/error';

const AdminList: React.FC = () => {
  const { teamId, folderId } = useParams<{
    teamId: string;
    folderId: string;
  }>();

  const resourceId = folderId ? folderId : teamId ? teamId : '';
  const resourceType: CollectionResourceType = folderId ? 'folder' : 'team';

  // query for membership
  const membershipQuery = useAdminsQuery(resourceId, resourceType);

  const queryStatus: FinQueryStatus = useFinQueryStatus(membershipQuery);

  const queryStatusComponent = useFinQueryStatusHandler({
    queryStatus,
  });

  if (queryStatusComponent || !membershipQuery.data) {
    return (
      <div>
        <PageTitle>
          <div className='col-12 col-md-3'>
            <h4>
              {queryStatus.isLoading
                ? 'Scribbling in Team Admins...'
                : 'Error loading Team Admins'}
            </h4>
            <h1>View Admins</h1>
          </div>
        </PageTitle>
        <div>{queryStatusComponent}</div>
      </div>
    );
  }

  const resourceName =
    membershipQuery.data.length > 0 ? membershipQuery.data[0].resourceName : '';

  return (
    <div>
      <PageTitle>
        <div className='col-12 col-md-3'>
          <h4>{resourceName}</h4>
          <h1>View Admins</h1>
        </div>
      </PageTitle>
      <table className='table'>
        <thead>
          <tr>
            <th>User Name</th>
            <th>User Email</th>
            <th>Level</th>
            <th>Role Name</th>
          </tr>
        </thead>
        <tbody>
          {membershipQuery.data &&
            membershipQuery.data
              .filter((m) => m.roleName === 'Admin')
              .map((member) => (
                <tr key={`${member.userEmail}-${member.level}`}>
                  <td>{member.userName}</td>
                  <td>{member.userEmail}</td>
                  <td>{member.level}</td>
                  <td>{member.roleName}</td>
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminList;
