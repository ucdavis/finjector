import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { useLeaveTeamMutation } from "../../queries/teamQueries";
import { useNavigate } from "react-router-dom";
import FinButton from "../Shared/FinButton";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPersonThroughWindow } from "@fortawesome/free-solid-svg-icons";
import addFinToast from "../Shared/LoadingAndErrors/FinToast";

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
  const dismiss = leaveMutation.isPending ? undefined : closeModal;

  const handleLeave = () => {
    leaveMutation.mutate(props.teamId, {
      onSuccess: () => {
        addFinToast("success", "Team left successfully.");
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
        onClosed={leaveMutation.reset}
        labelledBy="leave-team-title"
        modalTransition={{
          timeout: 300,
          "aria-modal": true,
          "aria-describedby": "leave-team-description",
        }}
      >
        <ModalHeader tag="h2" toggle={dismiss}>
          <span id="leave-team-title">Leave Team</span>
        </ModalHeader>
        <ModalBody
          id="leave-team-description"
          tabIndex={leaveMutation.isPending ? 0 : undefined}
        >
          Are you sure you want to leave this team?
          {isAdmin && (
            <p>
              You are an admin for this team. If you leave and there are no
              other admins, the team will be deleted.
            </p>
          )}
          {leaveMutation.isError && (
            <p className="alert alert-danger mt-2 mb-0" role="alert">
              Error leaving team.
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

export default LeaveTeamModal;
