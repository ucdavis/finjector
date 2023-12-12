import React, { useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { useLeaveTeamMutation } from "../../queries/teamQueries";
import { useNavigate } from "react-router-dom";
import FinjectorButton from "../Shared/FinjectorButton";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPersonThroughWindow } from "@fortawesome/free-solid-svg-icons";

interface Props {
  teamId: string;
  myPermissions: string[];
}

const LeaveTeam = (props: Props) => {
  const navigate = useNavigate();

  const [modalOpen, setModalOpen] = useState(false);

  const leaveMutation = useLeaveTeamMutation();

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const handleDelete = () => {
    leaveMutation.mutate(props.teamId, {
      onSuccess: () => {
        navigate("/teams");
        toggleModal();
      },
    });
  };

  return (
    <>
      <FinjectorButton onClick={toggleModal}>
        <FontAwesomeIcon icon={faPersonThroughWindow} />
        Leave Team
      </FinjectorButton>
      <Modal isOpen={modalOpen} toggle={toggleModal}>
        <ModalHeader tag="h2" toggle={toggleModal}>
          Leave Team
        </ModalHeader>
        <ModalBody>
          Are you sure you want to leave this team?
          {props.myPermissions.some((p) => p === "Admin") && (
            <p>
              You are an admin for this team. If you leave and there are no
              other admins, the team will be deleted.
            </p>
          )}
        </ModalBody>
        <ModalFooter>
          <FinjectorButton color="secondary" onClick={toggleModal}>
            Cancel
          </FinjectorButton>
          <FinjectorButton
            color="danger"
            onClick={handleDelete}
            disabled={leaveMutation.isLoading}
          >
            <FontAwesomeIcon icon={faPersonThroughWindow} />
            Leave
          </FinjectorButton>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default LeaveTeam;
