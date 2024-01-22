import React from "react";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  DropdownMenuProps,
} from "reactstrap";

interface FinjectorButtonDropdownProps extends DropdownMenuProps {
  title?: string;
  children: React.ReactNode;
  end?: boolean;
}

const FinjectorButtonDropdown = (props: FinjectorButtonDropdownProps) => {
  const { title, children, end = true, ...rest } = props;
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

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

export default FinjectorButtonDropdown;
