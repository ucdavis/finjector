import { FinError } from './FinError';

export const FinNotFound: React.FC = () => {
  return (
    <FinError
      title={'Not Found'}
      errorText="Sorry, the page you're looking for cannot be found. Please check the URL for errors, use the navigation menu to find what you need, or contact support for further assistance."
    />
  );
};
