import React from "react";
interface FinButtonDropdownProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  shouldRenderAsDropdown?: boolean;
}

const FinButtonDropdownItem = (props: FinButtonDropdownProps) => {
  const { children, shouldRenderAsDropdown = true, className = "", ...rest } = props;

  if (!shouldRenderAsDropdown) return <>{children}</>; // on personal team, default folder

  return (
    <div className={`dropdown-item ${className}`} {...rest}>
      {children}
    </div>
  );
};

export default FinButtonDropdownItem;
