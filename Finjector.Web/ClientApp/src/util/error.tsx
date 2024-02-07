import { FinError } from "../components/Shared/LoadingAndErrors/FinError";
import FinLoader from "../components/Shared/LoadingAndErrors/FinLoader";
import { FinNotAuthorized } from "../components/Shared/LoadingAndErrors/FinNotAuthorized";
import { FinNotFound } from "../components/Shared/LoadingAndErrors/FinNotFound";
import { FinQueryStatus } from "../types";
import { NotFoundError, UnauthorizedError } from "./api";

interface FinQueryStatesProps {
  queryStatus: FinQueryStatus;
  DefaultError?: React.ReactNode;
}

export const useFinQueryStatusHandler = ({
  queryStatus: { isInitialLoading, isError, error },
  DefaultError = <FinError />,
}: FinQueryStatesProps) => {
  if (isInitialLoading) {
    return <FinLoader />;
  }
  if (isError) {
    // since error is type unknown, we have to do a type guard
    if (typeof error === "object" && isErrorWithMessage(error)) {
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

function isErrorWithMessage(error: unknown): error is { message: string } {
  return typeof error === "object" && error !== null && "message" in error;
}
