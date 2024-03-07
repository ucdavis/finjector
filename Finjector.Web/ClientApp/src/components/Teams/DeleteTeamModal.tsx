import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import { useDeleteTeamMutation } from '../../queries/teamQueries';
import FinButton from '../Shared/FinButton';
import addFinToast from '../Shared/LoadingAndErrors/FinToast';

interface Props {
  teamId: string;
  isOpen: boolean;
  closeModal: () => void;
}

const DeleteTeamModal = (props: Props) => {
  const { isOpen, closeModal } = props;
  const navigate = useNavigate();

  const deleteMutation = useDeleteTeamMutation();

  const handleDelete = () => {
    deleteMutation.mutate(props.teamId, {
      onSuccess: () => {
        addFinToast('success', 'Team deleted successfully.');
        navigate('/teams');
        closeModal();
      },
      onError: (error) => {
        addFinToast('error', 'Error deleting team.');
      },
    });
  };

  return (
    <>
      <Modal isOpen={isOpen} toggle={closeModal}>
        <ModalHeader tag='h2' toggle={closeModal}>
          Delete Team
        </ModalHeader>
        <ModalBody>
          Are you sure you want to delete this team? This team, any folders
          within it will be removed.
        </ModalBody>
        <ModalFooter>
          <FinButton
            color='secondary'
            onClick={closeModal}
            disabled={deleteMutation.isPending}
          >
            Cancel
          </FinButton>
          <FinButton
            color='danger'
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            <FontAwesomeIcon icon={faTrash} />
            Delete
          </FinButton>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default DeleteTeamModal;
