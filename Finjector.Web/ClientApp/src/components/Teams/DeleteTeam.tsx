import React, { useState } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { useDeleteTeamMutation } from "../../queries/teamQueries";
import { useNavigate } from "react-router-dom";

interface Props {
  teamId: string;
  onDeleted: () => void;
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
      <button className="btn btn-new me-3" onClick={toggleModal}>
        Delete Team
      </button>
      <Modal isOpen={modalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Delete Team</ModalHeader>
        <ModalBody>
          Are you sure you want to delete this team? This team, any folders
          within it will be removed.
        </ModalBody>
        <ModalFooter>
          <Button
            color="danger"
            onClick={handleDelete}
            disabled={deleteMutation.isLoading}
          >
            Delete
          </Button>
          <Button color="secondary" onClick={toggleModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default DeleteTeam;
