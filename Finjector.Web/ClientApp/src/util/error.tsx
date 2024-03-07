import { UseQueryResult } from '@tanstack/react-query';

import { FinError } from '../components/Shared/LoadingAndErrors/FinError';
import FinLoader from '../components/Shared/LoadingAndErrors/FinLoader';
import { FinNotAuthorized } from '../components/Shared/LoadingAndErrors/FinNotAuthorized';
import { FinNotFound } from '../components/Shared/LoadingAndErrors/FinNotFound';
import { FinQueryStatus } from '../types';

import { NotFoundError, UnauthorizedError } from './api';

interface FinQueryStatesProps {
  queryStatus: FinQueryStatus;
  DefaultError?: React.ReactNode;
}

export const useFinQueryStatus = (query: UseQueryResult<any>) => {
  const queryStatus: FinQueryStatus = {
    isError: query.isError,
    isLoading: query.isLoading,
    error: query.error,
  };
  return queryStatus;
};

export const useFinQueryStatusHandler = ({
  queryStatus: { isLoading, isError, error },
  DefaultError = <FinError />,
}: FinQueryStatesProps) => {
  if (isLoading) {
    return <FinLoader />;
  }
  if (isError) {
    if (error) {
      // now we can handle specific error types through error.message
      if (error.message === UnauthorizedError) {
        return <FinNotAuthorized />;
      }
      if (error.message === NotFoundError) {
        return <FinNotFound />;
      }
    }
    return <>{DefaultError}</>;
  }
  return null;
};
