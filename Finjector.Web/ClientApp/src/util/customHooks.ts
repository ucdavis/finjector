import { useEffect, useState } from 'react';

const usePopupStatus = (): boolean => {
  const [isWindowOpenerPopulated, setIsWindowOpenerPopulated] = useState(false);

  useEffect(() => {
    setIsWindowOpenerPopulated(!!window.opener);
  }, []);

  return isWindowOpenerPopulated;
};

export default usePopupStatus;
