import React from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { useAddUserMutation } from "../../queries/userQueries";
import { CollectionResourceType } from "../../types";
import FinjectorButton from "../Shared/FinjectorButton";

interface Props {
  resourceId: string;
  resourceType: CollectionResourceType;
  active: boolean;
  toggle: () => void;
}

export const AddUserPermission = (props: Props) => {
  const [role, setRole] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [error, setError] = React.useState("");

  const addUserMutation = useAddUserMutation(
    props.resourceId,
    props.resourceType
  );

  const formValid = role !== "" && email !== "";

  const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRole(event.target.value);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleAssignRole = () => {
    addUserMutation.mutate(
      { role, email },
      {
        onSuccess: () => {
          resetForm();
        },
        onError: (err: any) => {
          setError(err.message);
        },
      }
    );
  };

  const resetForm = () => {
    setRole("");
    setEmail("");
    setError("");
    props.toggle();
  };

  return (
    <Modal isOpen={props.active} toggle={resetForm}>
      <ModalHeader toggle={resetForm}>Add New Role</ModalHeader>
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

          {error && <div className="alert alert-danger">{error}</div>}

          <FinjectorButton
            type="submit"
            className="btn btn-primary"
            onClick={handleAssignRole}
            disabled={!formValid || addUserMutation.isLoading}
          >
            {addUserMutation.isLoading
              ? "Assigning Role..."
              : "Assign Role to User"}
          </FinjectorButton>
        </form>
      </ModalBody>
    </Modal>
  );
};
