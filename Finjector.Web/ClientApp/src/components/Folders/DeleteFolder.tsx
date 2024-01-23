import React, { useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { useDeleteFolderMutation } from "../../queries/folderQueries";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import FinButton from "../Shared/FinButton";
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
      onError: (error) => {
        toast.error("Error deleting folder.");
      },
    });
  };

  return (
    <>
      <FinButton onClick={toggleModal}>
        <FontAwesomeIcon icon={faTrash} />
        Delete Folder
      </FinButton>
      <Modal isOpen={modalOpen} toggle={toggleModal}>
        <ModalHeader tag="h2" toggle={toggleModal}>
          Delete Folder
        </ModalHeader>
        <ModalBody>
          Are you sure you want to delete this folder? This folder, and any
          Chart Strings within it will be removed.
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
            {deleteMutation.isLoading ? "Deleting" : "Delete"}
          </FinButton>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default DeleteFolder;
