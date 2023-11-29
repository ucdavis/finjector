import { useRemoveUserMutation } from "../../queries/userQueries";
import { CollectionResourceType } from "../../types";
import FinjectorButton from "../Shared/FinjectorButton";

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
    removeUserMutation.isLoading || removeUserMutation.isSuccess;

  const handleRemovePermission = () => {
    removeUserMutation.mutate({ email: props.userEmail });
  };

  return (
    <FinjectorButton
      onClick={handleRemovePermission}
      disabled={removeInProgress}
    >
      {removeInProgress ? "Removing..." : "Remove"}
    </FinjectorButton>
  );
};
