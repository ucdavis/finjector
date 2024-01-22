import React from "react";
import { DropdownItem, DropdownItemProps } from "reactstrap";

interface FinjectorButtonDropdownProps extends DropdownItemProps {
  children: React.ReactNode;
}

const FinjectorButtonDropdownItem = (props: FinjectorButtonDropdownProps) => {
  const { children, ...rest } = props;

  return <DropdownItem {...rest}>{children}</DropdownItem>;
};

export default FinjectorButtonDropdownItem;
