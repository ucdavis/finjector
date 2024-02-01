import React from "react";
import { DropdownItem, DropdownItemProps } from "reactstrap";

interface FinButtonDropdownProps extends DropdownItemProps {
  children: React.ReactNode;
  shouldRenderAsDropdown?: boolean;
}

const FinButtonDropdownItem = (props: FinButtonDropdownProps) => {
  const { children, shouldRenderAsDropdown = true, ...rest } = props;

  if (!shouldRenderAsDropdown) return <>{children}</>; // on personal team, default folder

  return (
    <DropdownItem {...rest} tag={"div"}>
      {children}
    </DropdownItem>
  );
};

export default FinButtonDropdownItem;
