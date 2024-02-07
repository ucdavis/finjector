import React from "react";

interface FinEmptyProps {
  title?: string;
  children?: React.ReactNode;
}

const FinEmpty: React.FC<FinEmptyProps> = ({ title, children }) => {
  return (
    <div>
      <p>{title ?? "There are no items in this list."}</p>
      {children}
    </div>
  );
};

export default FinEmpty;
