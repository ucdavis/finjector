import React from "react";
import { ToastContainer } from "react-toastify";

const FinToastContainer = () => {
  return (
    <ToastContainer
      position="top-center"
      className="fin-notifications"
      autoClose={5000}
      hideProgressBar
      newestOnTop
      closeOnClick={false}
      rtl={false}
      draggable={true}
      pauseOnHover={true}
    />
  );
};

export default FinToastContainer;
