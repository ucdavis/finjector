import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { useDeleteFolderMutation } from "../../queries/folderQueries";
import { useNavigate } from "react-router-dom";
import FinjectorButton from "../Shared/FinjectorButton";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

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
        navigate(`/teams/${props.teamId}`);
        closeModal();
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
        <FinjectorButton color="secondary" onClick={closeModal}>
          Cancel
        </FinjectorButton>
        <FinjectorButton
          color="danger"
          onClick={handleDelete}
          disabled={deleteMutation.isLoading}
        >
          <FontAwesomeIcon icon={faTrash} />
          {deleteMutation.isLoading ? "Deleting" : "Delete"}
        </FinjectorButton>
      </ModalFooter>
    </Modal>
  );
};

export default DeleteFolderModal;
