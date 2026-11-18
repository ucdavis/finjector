import { useRemoveUserMutation } from "../../queries/userQueries";
import { CollectionResourceType } from "../../types";
import FinButton from "../Shared/FinButton";
import addFinToast from "../Shared/LoadingAndErrors/FinToast";

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
    const confirmed = window.confirm(
      `Remove the ${props.resourceType} role for ${props.userEmail}?`
    );
    if (!confirmed) {
      return;
    }

    removeUserMutation.mutate(
      { email: props.userEmail },
      {
        onSuccess: () =>
          addFinToast("success", `Removed the role for ${props.userEmail}.`),
        onError: () =>
          addFinToast("error", `Could not remove the role for ${props.userEmail}.`),
      }
    );
  };

  return (
    <FinButton
      onClick={handleRemovePermission}
      disabled={removeInProgress}
      aria-label={`Remove role for ${props.userEmail}`}
    >
      {removeInProgress ? "Removing..." : "Remove"}
    </FinButton>
  );
};
