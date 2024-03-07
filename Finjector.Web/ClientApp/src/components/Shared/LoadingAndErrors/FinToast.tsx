import { toast } from 'react-toastify';

const addFinToast = (
  type: 'success' | 'error' | 'warning',
  message: string
) => {
  toast[type](message);
};

export default addFinToast;
