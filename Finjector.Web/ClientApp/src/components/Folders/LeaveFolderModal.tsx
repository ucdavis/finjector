import { faPersonThroughWindow } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import { useLeaveFolderMutation } from '../../queries/folderQueries';
import FinButton from '../Shared/FinButton';
import addFinToast from '../Shared/LoadingAndErrors/FinToast';

interface Props {
  teamId: string;
  folderId: string;
  isOpen: boolean;
  closeModal: () => void;
}

const LeaveFolderModal = (props: Props) => {
  const { isOpen, closeModal } = props;

  const navigate = useNavigate();

  const leaveMutation = useLeaveFolderMutation(props.teamId);

  const handleLeave = () => {
    leaveMutation.mutate(props.folderId, {
      onSuccess: () => {
        addFinToast('success', 'Folder left successfully.');
        navigate('/teams');
        closeModal();
      },
      onError: () => {
        addFinToast('error', 'Error leaving folder.');
      },
    });
  };

  return (
    <>
      <Modal isOpen={isOpen} toggle={closeModal}>
        <ModalHeader tag='h2' toggle={closeModal}>
          Leave Folder
        </ModalHeader>
        <ModalBody>
          <p>Are you sure you want to leave this folder?</p>
        </ModalBody>
        <ModalFooter>
          <FinButton
            color='secondary'
            onClick={closeModal}
            disabled={leaveMutation.isPending}
          >
            Cancel
          </FinButton>
          <FinButton
            color='danger'
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

export default LeaveFolderModal;
