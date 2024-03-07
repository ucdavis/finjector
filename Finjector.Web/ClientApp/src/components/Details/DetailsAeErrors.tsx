import { Alert } from 'reactstrap';

interface DetailsAeErrorsProps {
  errors?: string[];
  warnings?: string[];
}

const DetailsAeErrors: React.FC<DetailsAeErrorsProps> = ({
  errors,
  warnings,
}) => {
  if (!errors && !warnings) return null;

  return (
    <div>
      {errors?.map((error, i) => {
        return (
          <Alert color='danger' key={i}>
            Error: {error}
          </Alert>
        );
      })}
      {warnings?.map((warning, i) => {
        return (
          <Alert color='warning' key={i}>
            Warning: {warning}
          </Alert>
        );
      })}
    </div>
  );
};
export default DetailsAeErrors;
