import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { useNavigate } from "react-router-dom";
import FinButton from "../Shared/Layout/FinButton";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPersonThroughWindow } from "@fortawesome/free-solid-svg-icons";
import { useLeaveFolderMutation } from "../../queries/folderQueries";

interface Props {
  teamId: string;
  folderId: string;
  isOpen: boolean;
  closeModal: () => void;
}

const LeaveFolderModal = (props: Props) => {
  const { isOpen, closeModal } = props;

  const navigate = useNavigate();

  const leaveMutation = useLeaveFolderMutation(props.teamId);

  const handleLeave = () => {
    leaveMutation.mutate(props.folderId, {
      onSuccess: () => {
        navigate(`/teams`);
        closeModal();
      },
    });
  };

  return (
    <>
      <Modal isOpen={isOpen} toggle={closeModal}>
        <ModalHeader tag="h2" toggle={closeModal}>
          Leave Folder
        </ModalHeader>
        <ModalBody>
          <p>Are you sure you want to leave this folder?</p>
        </ModalBody>
        <ModalFooter>
          <FinButton color="secondary" onClick={closeModal}>
            Cancel
          </FinButton>
          <FinButton
            color="danger"
            onClick={handleLeave}
            disabled={leaveMutation.isLoading}
          >
            <FontAwesomeIcon icon={faPersonThroughWindow} />
            Leave
          </FinButton>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default LeaveFolderModal;
