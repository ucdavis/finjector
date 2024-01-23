import React, { useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { useDeleteTeamMutation } from "../../queries/teamQueries";
import { useNavigate } from "react-router-dom";
import FinButton from "../Shared/FinButton";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

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
      <FinButton onClick={toggleModal}>
        <FontAwesomeIcon icon={faTrash} />
        Delete Team
      </FinButton>
      <Modal isOpen={modalOpen} toggle={toggleModal}>
        <ModalHeader tag="h2" toggle={toggleModal}>
          Delete Team
        </ModalHeader>
        <ModalBody>
          Are you sure you want to delete this team? This team, any folders
          within it will be removed.
        </ModalBody>
        <ModalFooter>
          <FinButton color="secondary" onClick={toggleModal}>
            Cancel
          </FinButton>
          <FinButton
            color="danger"
            onClick={handleDelete}
            disabled={deleteMutation.isLoading}
          >
            <FontAwesomeIcon icon={faTrash} />
            Delete
          </FinButton>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default DeleteTeam;
