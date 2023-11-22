import React from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";

interface Props {
  active: boolean;
  toggle: () => void;
}

export const AddUserPermission = (props: Props) => {
  const [role, setRole] = React.useState("");
  const [email, setEmail] = React.useState("");

  const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRole(event.target.value);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleAssignRole = () => {
    // TODO: Implement assign role logic
  };

  return (
    <Modal isOpen={props.active} toggle={props.toggle}>
      <ModalHeader toggle={props.toggle}>Add New Role (TODO)</ModalHeader>
      <ModalBody>
        <form>
          <div className="mb-3">
            <label htmlFor="role" className="form-label">
              Role
            </label>
            <select
              id="role"
              className="form-select"
              value={role}
              onChange={handleRoleChange}
            >
              <option value="">Select Role</option>
              <option value="view">View</option>
              <option value="edit">Edit</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="text"
              id="email"
              className="form-control"
              value={email}
              onChange={handleEmailChange}
            />
          </div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleAssignRole}
          >
            Assign Role to User
          </button>
        </form>
      </ModalBody>
    </Modal>
  );
};
