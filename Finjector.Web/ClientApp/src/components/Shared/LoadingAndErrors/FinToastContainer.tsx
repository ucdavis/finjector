import React from 'react';
import { ToastContainer } from 'react-toastify';

const FinToastContainer = () => {
  return (
    <ToastContainer
      position='top-center'
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick={true}
      rtl={false}
      draggable={true}
      pauseOnHover={true}
    />
  );
};

export default FinToastContainer;
