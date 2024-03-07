import {
  faUserTie,
  faPlus,
  faPencil,
  faUsers,
  faTrash,
  faPersonThroughWindow,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

import { FinQueryStatus, TeamResponseModel } from '../../types';
import { isPersonalOrDefault } from '../../util/teamDefinitions';
import FinButton from '../Shared/FinButton';
import FinButtonDropdown from '../Shared/FinButtonDropdown';
import FinButtonDropdownItem from '../Shared/FinButtonDropdownItem';
import PageInfo from '../Shared/Layout/PageInfo';
import PageTitle from '../Shared/Layout/PageTitle';

import DeleteTeamModal from './DeleteTeamModal';
import LeaveTeamModal from './LeaveTeamModal';

interface TeamTitleProps {
  teamModelData: TeamResponseModel | undefined;
  teamId: string;
  queryStatus: FinQueryStatus;
}

const TeamTitle: React.FC<TeamTitleProps> = ({
  teamModelData,
  teamId,
  queryStatus,
}) => {
  const [modalOpen, setModalOpen] = React.useState('');
  const toggleModal = (modalType: string) => {
    setModalOpen(modalType);
  };

  if (queryStatus.isLoading || queryStatus.isError || !teamModelData) {
    return (
      <PageTitle>
        <div className='col-12 col-md-9'>
          <h1>
            {queryStatus.isLoading
              ? 'Scribbling in Your Team...'
              : 'Error loading Team'}
          </h1>
        </div>
        {/* no disabled FinButtonDropdown because it doesn't render on personal */}
      </PageTitle>
    );
  }

  const isTeamAdmin = teamModelData.team.myTeamPermissions.some(
    (p) => p === 'Admin',
  );

  const limitedTeam = isPersonalOrDefault(teamModelData.team.name);

  return (
    <>
      <PageTitle>
        <div className='col-12 col-md-9'>
          <h1>{teamModelData.team.name}</h1>
        </div>
        <div className='col-12 col-md-3 text-end'>
          <FinButtonDropdown shouldRenderAsDropdown={!limitedTeam}>
            {/* don't show team admins if you are an admin or if it's a personal team */}
            {limitedTeam ||
              (!isTeamAdmin && (
                <FinButtonDropdownItem>
                  <FinButton borderless={true} to={`/teams/${teamId}/admins`}>
                    <FontAwesomeIcon icon={faUserTie} />
                    View Team Admins
                  </FinButton>
                </FinButtonDropdownItem>
              ))}
            {!limitedTeam && isTeamAdmin && (
              <>
                <FinButtonDropdownItem>
                  <FinButton
                    borderless={true}
                    to={`/teams/${teamId}/folders/create`}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                    Create New Folder
                  </FinButton>
                </FinButtonDropdownItem>
                <FinButtonDropdownItem>
                  <FinButton borderless={true} to={`/teams/${teamId}/edit`}>
                    <FontAwesomeIcon icon={faPencil} />
                    Edit Team
                  </FinButton>
                </FinButtonDropdownItem>
                <FinButtonDropdownItem>
                  <FinButton
                    borderless={true}
                    to={`/teams/${teamId}/permissions`}
                  >
                    <FontAwesomeIcon icon={faUsers} />
                    Manage Team Users
                  </FinButton>
                </FinButtonDropdownItem>
                <FinButtonDropdownItem>
                  <FinButton
                    borderless={true}
                    onClick={() => toggleModal('delete')}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                    Delete Team
                  </FinButton>{' '}
                </FinButtonDropdownItem>
              </>
            )}

            {!limitedTeam && (
              <FinButtonDropdownItem>
                <FinButton
                  borderless={true}
                  onClick={() => toggleModal('leave')}
                >
                  <FontAwesomeIcon icon={faPersonThroughWindow} />
                  Leave Team
                </FinButton>
              </FinButtonDropdownItem>
            )}
          </FinButtonDropdown>
        </div>
      </PageTitle>
      <PageInfo>{teamModelData.team.description}</PageInfo>
      {!limitedTeam && (
        <LeaveTeamModal
          teamId={teamId}
          isAdmin={isTeamAdmin !== undefined && isTeamAdmin}
          isOpen={modalOpen === 'leave'}
          closeModal={() => toggleModal('')}
        />
      )}
      {!limitedTeam && isTeamAdmin && (
        <DeleteTeamModal
          teamId={teamId}
          isOpen={modalOpen === 'delete'}
          closeModal={() => toggleModal('')}
        />
      )}
    </>
  );
};

export default TeamTitle;
