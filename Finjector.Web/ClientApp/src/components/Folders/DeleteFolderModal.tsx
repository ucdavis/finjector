import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { useDeleteFolderMutation } from "../../queries/folderQueries";
import { useNavigate } from "react-router-dom";
import FinButton from "../Shared/FinButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import addFinToast from "../Shared/LoadingAndErrors/FinToast";

interface Props {
  teamId: string;
  folderId: string;
  isOpen: boolean;
  closeModal: () => void;
}

const DeleteFolderModal = (props: Props) => {
  const { isOpen, closeModal } = props;
  const navigate = useNavigate();

  const deleteMutation = useDeleteFolderMutation();

  const handleDelete = () => {
    deleteMutation.mutate(props.folderId, {
      onSuccess: () => {
        //we don't want to redirect to the teams/teamId here because the user may not have permissions to the team, just the folder.
        //We could pass this in as a prop if we wanted to redirect to the team, but it isn't worth it.
        addFinToast("success", "Folder deleted successfully.");
        navigate(`/teams`);
        closeModal();
      },
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      toggle={closeModal}
      trapFocus
      onClosed={deleteMutation.reset}
      labelledBy="delete-folder-title"
      modalTransition={{
        timeout: 300,
        "aria-modal": true,
        "aria-describedby": "delete-folder-description",
      }}
    >
      <ModalHeader tag="h2" toggle={closeModal}>
        <span id="delete-folder-title">Delete Folder</span>
      </ModalHeader>
      <ModalBody id="delete-folder-description">
        Are you sure you want to delete this folder? This folder, and any Chart
        Strings within it will be removed.
        {deleteMutation.isError && (
          <p className="alert alert-danger mt-2 mb-0" role="alert">
            Error deleting folder.
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
          {deleteMutation.isPending ? "Deleting" : "Delete"}
        </FinButton>
      </ModalFooter>
    </Modal>
  );
};

export default DeleteFolderModal;
