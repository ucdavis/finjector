import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { useNavigate } from "react-router-dom";
import FinButton from "../Shared/FinButton";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPersonThroughWindow } from "@fortawesome/free-solid-svg-icons";
import { useLeaveFolderMutation } from "../../queries/folderQueries";
import addFinToast from "../Shared/LoadingAndErrors/FinToast";

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
        addFinToast("success", "Folder left successfully.");
        navigate(`/teams`);
        closeModal();
      },
    });
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        toggle={closeModal}
        trapFocus
        onClosed={leaveMutation.reset}
        labelledBy="leave-folder-title"
        modalTransition={{
          timeout: 300,
          "aria-modal": true,
          "aria-describedby": "leave-folder-description",
        }}
      >
        <ModalHeader tag="h2" toggle={closeModal}>
          <span id="leave-folder-title">Leave Folder</span>
        </ModalHeader>
        <ModalBody id="leave-folder-description">
          <p>Are you sure you want to leave this folder?</p>
          {leaveMutation.isError && (
            <p className="alert alert-danger mt-2 mb-0" role="alert">
              Error leaving folder.
            </p>
          )}
        </ModalBody>
        <ModalFooter>
          <FinButton
            color="secondary"
            onClick={closeModal}
            disabled={leaveMutation.isPending}
          >
            Cancel
          </FinButton>
          <FinButton
            color="danger"
            onClick={handleLeave}
            disabled={leaveMutation.isPending}
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
