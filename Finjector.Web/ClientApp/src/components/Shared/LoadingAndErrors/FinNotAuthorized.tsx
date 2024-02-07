import { FinError } from "./FinError";

export const FinNotAuthorized: React.FC = () => {
  return (
    <FinError
      title={"Not Authorized"}
      errorText="You are not authorized to view this content. Please double check you are
    trying to access the correct page. If you believe this is in error, please
    contact your team or folder administrator(s)."
    />
  );
};
