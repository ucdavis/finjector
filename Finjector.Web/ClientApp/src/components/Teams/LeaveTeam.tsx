import React, { useState } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { useLeaveTeamMutation } from "../../queries/teamQueries";
import { useNavigate } from "react-router-dom";
import FinjectorButton from "../Shared/FinjectorButton";

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
      <FinjectorButton onClick={toggleModal}>Leave Team</FinjectorButton>
      <Modal isOpen={modalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Leave Team</ModalHeader>
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
          <FinjectorButton
            color="danger"
            onClick={handleDelete}
            disabled={leaveMutation.isLoading}
          >
            Leave
          </FinjectorButton>
          <FinjectorButton color="secondary" onClick={toggleModal}>
            Cancel
          </FinjectorButton>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default LeaveTeam;
