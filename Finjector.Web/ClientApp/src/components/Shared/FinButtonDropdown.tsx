import React from "react";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  DropdownMenuProps,
} from "reactstrap";

interface FinButtonDropdownProps extends DropdownMenuProps {
  title?: string;
  children: React.ReactNode;
  end?: boolean;
  shouldRenderAsDropdown?: boolean;
}

const FinButtonDropdown = (props: FinButtonDropdownProps) => {
  const {
    title,
    children,
    end = true,
    shouldRenderAsDropdown = true,
    ...rest
  } = props;
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  if (!shouldRenderAsDropdown) return <>{children}</>; // on personal team, default folder

  const toggle = () => setDropdownOpen((prevState) => !prevState);
  return (
    <Dropdown isOpen={dropdownOpen} toggle={toggle}>
      <DropdownToggle className="btn-finjector" caret={true}>
        Actions
      </DropdownToggle>
      <DropdownMenu end={end} {...rest}>
        {title && <DropdownItem header>{title}</DropdownItem>}
        {children}
      </DropdownMenu>
    </Dropdown>
  );
};

export default FinButtonDropdown;
