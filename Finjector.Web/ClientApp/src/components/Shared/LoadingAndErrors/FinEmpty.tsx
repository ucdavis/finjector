import React from "react";

interface FinEmptyProps {
  title?: string;
  children?: React.ReactNode;
}

const FinEmpty: React.FC<FinEmptyProps> = ({ title, children }) => {
  return (
    <div className="p-2 col-6">
      <h2>{title ?? "There are no items in this list."}</h2>
      {children}
    </div>
  );
};

export default FinEmpty;
