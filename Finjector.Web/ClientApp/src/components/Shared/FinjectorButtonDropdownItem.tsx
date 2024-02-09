import React from "react";
import { DropdownItem, DropdownItemProps } from "reactstrap";

interface FinjectorButtonDropdownProps extends DropdownItemProps {
  children: React.ReactNode;
  shouldRenderAsDropdown?: boolean;
}

const FinjectorButtonDropdownItem = (props: FinjectorButtonDropdownProps) => {
  const { children, shouldRenderAsDropdown = true, ...rest } = props;

  if (!shouldRenderAsDropdown) return <>{children}</>; // on personal team, default folder

  return (
    <DropdownItem className="dropdown-item-finjector" {...rest} tag={"div"}>
      {children}
    </DropdownItem>
  );
};

export default FinjectorButtonDropdownItem;
