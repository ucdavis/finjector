import React, { useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { useDeleteTeamMutation } from "../../queries/teamQueries";
import { useNavigate } from "react-router-dom";
import FinjectorButton from "../Shared/FinjectorButton";

interface Props {
  teamId: string;
}

const DeleteTeam = (props: Props) => {
  const navigate = useNavigate();

  const [modalOpen, setModalOpen] = useState(false);

  const deleteMutation = useDeleteTeamMutation();

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const handleDelete = () => {
    deleteMutation.mutate(props.teamId, {
      onSuccess: () => {
        navigate("/teams");
        toggleModal();
      },
    });
  };

  return (
    <>
      <FinjectorButton onClick={toggleModal}>Delete Team</FinjectorButton>
      <Modal isOpen={modalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Delete Team</ModalHeader>
        <ModalBody>
          Are you sure you want to delete this team? This team, any folders
          within it will be removed.
        </ModalBody>
        <ModalFooter>
          <FinjectorButton
            color="danger"
            onClick={handleDelete}
            disabled={deleteMutation.isLoading}
          >
            Delete
          </FinjectorButton>
          <FinjectorButton color="secondary" onClick={toggleModal}>
            Cancel
          </FinjectorButton>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default DeleteTeam;
