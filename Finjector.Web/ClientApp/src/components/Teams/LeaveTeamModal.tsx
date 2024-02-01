import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { useLeaveTeamMutation } from "../../queries/teamQueries";
import { useNavigate } from "react-router-dom";
import FinButton from "../Shared/FinButton";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPersonThroughWindow } from "@fortawesome/free-solid-svg-icons";

interface Props {
  teamId: string;
  isAdmin: boolean;
  isOpen: boolean;
  closeModal: () => void;
}

const LeaveTeamModal = (props: Props) => {
  const { isAdmin, isOpen, closeModal } = props;
  const navigate = useNavigate();

  const leaveMutation = useLeaveTeamMutation();

  const handleLeave = () => {
    leaveMutation.mutate(props.teamId, {
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
          Leave Team
        </ModalHeader>
        <ModalBody>
          Are you sure you want to leave this team?
          {isAdmin && (
            <p>
              You are an admin for this team. If you leave and there are no
              other admins, the team will be deleted.
            </p>
          )}
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

export default LeaveTeamModal;
