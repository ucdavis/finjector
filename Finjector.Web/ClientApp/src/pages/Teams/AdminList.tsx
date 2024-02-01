import React from "react";
import { useParams } from "react-router-dom";
import { useAdminsQuery } from "../../queries/userQueries";
import { CollectionResourceType } from "../../types";
import PageTitle from "../../components/Shared/Layout/PageTitle";

const AdminList: React.FC = () => {
  const { teamId, folderId } = useParams<{
    teamId: string;
    folderId: string;
  }>();

  const resourceId = folderId ? folderId : teamId ? teamId : "";
  const resourceType: CollectionResourceType = folderId ? "folder" : "team";

  // query for membership
  const membershipQuery = useAdminsQuery(resourceId, resourceType);

  if (membershipQuery.isLoading) {
    return <div>Loading...</div>;
  }
  const forTeamName = !!membershipQuery?.data?.length
    ? `For ${membershipQuery.data[0].resourceName}`
    : "";
  // show error message if user is unauthorized
  if (membershipQuery.isError) {
    var err: Error = membershipQuery.error;

    var errorContent = <div>Something went wrong...</div>;

    if (err.message === "401 Unauthorized") {
      errorContent = <div>You are not authorized to view this page</div>;
    }

    return (
      <div>
        <PageTitle title={`View Admins ${forTeamName}`} />
        {errorContent}
      </div>
    );
  }

  const resourceName =
    membershipQuery.data.length > 0 ? membershipQuery.data[0].resourceName : "";

  return (
    <div>
      <PageTitle>
        <div className="col-12 col-md-3">
          <h4>{resourceName}</h4>
          <h1>View Admins</h1>
        </div>
      </PageTitle>
      <table className="table">
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
              .filter((m) => m.roleName === "Admin")
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
