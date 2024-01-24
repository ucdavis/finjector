import { Alert } from "reactstrap";

interface DetailsAeErrorsProps {
  errors: string[] | undefined;
  hasWarnings: boolean | undefined;
  warnings: string[] | undefined;
}

const DetailsAeErrors = (props: DetailsAeErrorsProps) => {
  const { errors, hasWarnings, warnings } = props;

  if (!errors && !warnings) return null;

  return (
    <div>
      {!!errors &&
        errors.length > 0 &&
        errors.map((error, i) => {
          return (
            <Alert color="danger" key={i}>
              Error: {error}
            </Alert>
          );
        })}
      {hasWarnings &&
        !!warnings &&
        warnings.length > 0 &&
        warnings.map((warning, i) => {
          return (
            <Alert color="warning" key={i}>
              Warning: {warning}
            </Alert>
          );
        })}
    </div>
  );
};
export default DetailsAeErrors;
