import React, { useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { useDeleteFolderMutation } from "../../queries/folderQueries";
import { useNavigate } from "react-router-dom";
import FinjectorButton from "../Shared/FinjectorButton";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

interface Props {
  folderId: string;
}

const DeleteFolder = (props: Props) => {
  const navigate = useNavigate();

  const [modalOpen, setModalOpen] = useState(false);

  const deleteMutation = useDeleteFolderMutation();

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const handleDelete = () => {
    deleteMutation.mutate(props.folderId, {
      onSuccess: () => {
        navigate("/teams");
        setModalOpen(false);
      },
    });
  };

  return (
    <>
      <FinjectorButton onClick={toggleModal} className="btn-borderless">
        <FontAwesomeIcon icon={faTrash} />
        Delete Folder
      </FinjectorButton>
      <Modal isOpen={modalOpen} toggle={toggleModal}>
        <ModalHeader tag="h2" toggle={toggleModal}>
          Delete Folder
        </ModalHeader>
        <ModalBody>
          Are you sure you want to delete this folder? This folder, and any
          Chart Strings within it will be removed.
        </ModalBody>
        <ModalFooter>
          <FinjectorButton color="secondary" onClick={toggleModal}>
            Cancel
          </FinjectorButton>
          <FinjectorButton
            color="danger"
            onClick={handleDelete}
            disabled={deleteMutation.isLoading}
          >
            <FontAwesomeIcon icon={faTrash} />
            {deleteMutation.isLoading ? "Deleting" : "Delete"}
          </FinjectorButton>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default DeleteFolder;
