import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { useDeleteTeamMutation } from "../../queries/teamQueries";
import { useNavigate } from "react-router-dom";
import FinjectorButton from "../Shared/Layout/FinjButton";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

interface Props {
  teamId: string;
  isOpen: boolean;
  closeModal: () => void;
}

const DeleteTeamModal = (props: Props) => {
  const { isOpen, closeModal } = props;
  const navigate = useNavigate();

  const deleteMutation = useDeleteTeamMutation();

  const handleDelete = () => {
    deleteMutation.mutate(props.teamId, {
      onSuccess: () => {
        navigate("/teams");
        closeModal();
      },
    });
  };

  return (
    <>
      <Modal isOpen={isOpen} toggle={closeModal}>
        <ModalHeader tag="h2" toggle={closeModal}>
          Delete Team
        </ModalHeader>
        <ModalBody>
          Are you sure you want to delete this team? This team, any folders
          within it will be removed.
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
            Delete
          </FinjectorButton>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default DeleteTeamModal;
