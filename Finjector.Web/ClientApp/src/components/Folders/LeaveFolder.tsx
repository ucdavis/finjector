import React, { useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { useNavigate } from "react-router-dom";
import FinButton from "../Shared/FinButton";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPersonThroughWindow } from "@fortawesome/free-solid-svg-icons";
import { useLeaveFolderMutation } from "../../queries/folderQueries";

interface Props {
  teamId: string;
  folderId: string;
  myFolderPermissions: string[];
  myTeamPermissions: string[];
}

const LeaveFolder = (props: Props) => {
  const navigate = useNavigate();

  const [modalOpen, setModalOpen] = useState(false);

  const leaveMutation = useLeaveFolderMutation(props.teamId);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const handleDelete = () => {
    leaveMutation.mutate(props.folderId, {
      onSuccess: () => {
        navigate("/teams");
        toggleModal();
      },
      onError: (error) => {
        toast.error("Error leaving folder.");
      },
    });
  };

  const hasFolderPermissions = props.myFolderPermissions.length > 0;

  if (!hasFolderPermissions) {
    return null;
  }

  return (
    <>
      <FinButton onClick={toggleModal}>
        <FontAwesomeIcon icon={faPersonThroughWindow} />
        Leave Folder
      </FinButton>
      <Modal isOpen={modalOpen} toggle={toggleModal}>
        <ModalHeader tag="h2" toggle={toggleModal}>
          Leave Folder
        </ModalHeader>
        <ModalBody>
          <p>Are you sure you want to leave this folder?</p>
          {props.myTeamPermissions.length > 0 && (
            <p>
              You have permissions to the team this folder is in. If you leave
              this folder you will still have access to it through the team, but
              your folder permissions will be removed.
            </p>
          )}
        </ModalBody>
        <ModalFooter>
          <FinButton color="secondary" onClick={toggleModal}>
            Cancel
          </FinButton>
          <FinButton
            color="danger"
            onClick={handleDelete}
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

export default LeaveFolder;
