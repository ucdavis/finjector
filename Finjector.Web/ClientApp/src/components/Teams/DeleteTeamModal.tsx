import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { useDeleteTeamMutation } from "../../queries/teamQueries";
import { useNavigate } from "react-router-dom";
import FinButton from "../Shared/FinButton";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import addFinToast from "../Shared/LoadingAndErrors/FinToast";

interface Props {
  teamId: string;
  isOpen: boolean;
  closeModal: () => void;
}

const DeleteTeamModal = (props: Props) => {
  const { isOpen, closeModal } = props;
  const navigate = useNavigate();

  const deleteMutation = useDeleteTeamMutation();
  const dismiss = deleteMutation.isPending ? undefined : closeModal;

  const handleDelete = () => {
    deleteMutation.mutate(props.teamId, {
      onSuccess: () => {
        addFinToast("success", "Team deleted successfully.");
        navigate("/teams");
        closeModal();
      },
    });
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        toggle={dismiss}
        trapFocus
        onClosed={deleteMutation.reset}
        labelledBy="delete-team-title"
        modalTransition={{
          timeout: 300,
          "aria-modal": true,
          "aria-describedby": "delete-team-description",
        }}
      >
        <ModalHeader tag="h2" toggle={dismiss}>
          <span id="delete-team-title">Delete Team</span>
        </ModalHeader>
        <ModalBody
          id="delete-team-description"
          tabIndex={deleteMutation.isPending ? 0 : undefined}
        >
          Are you sure you want to delete this team? This team, any folders
          within it will be removed.
          {deleteMutation.isError && (
            <p className="alert alert-danger mt-2 mb-0" role="alert">
              Error deleting team.
            </p>
          )}
        </ModalBody>
        <ModalFooter>
          <FinButton
            color="secondary"
            onClick={closeModal}
            disabled={deleteMutation.isPending}
          >
            Cancel
          </FinButton>
          <FinButton
            color="danger"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            <FontAwesomeIcon icon={faTrash} />
            Delete
          </FinButton>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default DeleteTeamModal;
