import { useRemoveUserMutation } from "../../queries/userQueries";
import { CollectionResourceType } from "../../types";
import FinButton from "../Shared/FinButton";

interface Props {
  resourceId: string;
  resourceType: CollectionResourceType;
  userEmail: string;
}

export const RemoveUserPermission = (props: Props) => {
  const removeUserMutation = useRemoveUserMutation(
    props.resourceId,
    props.resourceType
  );

  const removeInProgress =
    removeUserMutation.isPending || removeUserMutation.isSuccess;

  const handleRemovePermission = () => {
    removeUserMutation.mutate({ email: props.userEmail });
  };

  return (
    <FinButton onClick={handleRemovePermission} disabled={removeInProgress}>
      {removeInProgress ? "Removing..." : "Remove"}
    </FinButton>
  );
};
