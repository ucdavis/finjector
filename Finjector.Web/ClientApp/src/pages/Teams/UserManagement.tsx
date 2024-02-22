import { useParams } from "react-router-dom";
import { usePermissionsQuery } from "../../queries/userQueries";
import { CollectionResourceType, FinQueryStatus } from "../../types";
import UserPermissionTable from "../../components/Teams/UserPermissionTable";
import UserPermissionTitle from "../../components/Teams/UserPermissionTitle";
import { useFinQueryStatus } from "../../util/error";

const UserManagement: React.FC = () => {
  // read (team) id and folderId from the url
  const { teamId, folderId } = useParams();

  const resourceId = folderId ? folderId : teamId ? teamId : "";
  const resourceType: CollectionResourceType = folderId ? "folder" : "team";

  // query for membership
  const membershipQuery = usePermissionsQuery(resourceId, resourceType);

  const queryStatus: FinQueryStatus = useFinQueryStatus(membershipQuery);

  return (
    <div>
      <UserPermissionTitle
        membershipQueryData={membershipQuery.data}
        resourceId={resourceId}
        resourceType={resourceType}
        folderId={folderId}
        queryStatus={queryStatus}
      />
      <UserPermissionTable
        membershipQueryData={membershipQuery.data}
        resourceId={resourceId}
        resourceType={resourceType}
        queryStatus={queryStatus}
      />
    </div>
  );
};

export default UserManagement;
