import React from "react";
import { useParams } from "react-router-dom";
import { BackLinkBar } from "../../components/Shared/BackLinkBar";
import { useAdminsQuery } from "../../queries/userQueries";
import { CollectionResourceType } from "../../types";

const AdminList: React.FC = () => {
  const { id, folderId } = useParams<{ id: string; folderId: string }>();

  const resourceId = folderId ? folderId : id ? id : "";
  const resourceType: CollectionResourceType = folderId ? "folder" : "team";

  // query for membership
  const membershipQuery = useAdminsQuery(resourceId, resourceType);

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
        <h2>View Permissions</h2>
        {errorContent}
        <BackLinkBar />
      </div>
    );
  }

  return (
    <div>
      <BackLinkBar />
      <h2>View Admins</h2>
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
                <tr key={member.userEmail}>
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
