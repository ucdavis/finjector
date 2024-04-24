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
      onError: () => {
        addFinToast("error", "Error deleting folder.");
      },
    });
  };

  return (
    <Modal isOpen={isOpen} toggle={closeModal}>
      <ModalHeader tag="h2" toggle={closeModal}>
        Delete Folder
      </ModalHeader>
      <ModalBody>
        Are you sure you want to delete this folder? This folder, and any Chart
        Strings within it will be removed.
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
