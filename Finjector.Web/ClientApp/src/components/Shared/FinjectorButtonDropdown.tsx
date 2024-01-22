import { faHamburger } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
}

const FinjectorButtonDropdown = (props: FinjectorButtonDropdownProps) => {
  const { title, children, ...rest } = props;
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const toggle = () => setDropdownOpen((prevState) => !prevState);

  return (
    <Dropdown isOpen={dropdownOpen} toggle={toggle}>
      <DropdownToggle caret={true}>
        <FontAwesomeIcon icon={faHamburger} />
      </DropdownToggle>
      <DropdownMenu {...rest}>
        {title && <DropdownItem header>{title}</DropdownItem>}
        {children}
      </DropdownMenu>
    </Dropdown>
  );
};

export default FinjectorButtonDropdown;
