import React from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { useAddUserMutation } from "../../queries/userQueries";
import { CollectionResourceType } from "../../types";
import FinButton from "../Shared/FinButton";
import addFinToast from "../Shared/LoadingAndErrors/FinToast";

interface Props {
  resourceId: string;
  resourceType: CollectionResourceType;
  active: boolean;
  onClose: () => void;
}

export const AddUserPermission = (props: Props) => {
  const [role, setRole] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [error, setError] = React.useState("");

  const addUserMutation = useAddUserMutation(
    props.resourceId,
    props.resourceType
  );

  const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRole(event.target.value);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleAssignRole = (e: React.FormEvent) => {
    e.preventDefault();

    addUserMutation.mutate(
      { role, email },
      {
        onSuccess: () => {
          addFinToast("success", `Assigned the ${role} role to ${email}.`);
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
    props.onClose();
  };

  return (
    <Modal
      isOpen={props.active}
      toggle={resetForm}
      trapFocus
      labelledBy="add-role-title"
      modalTransition={{ timeout: 300, "aria-modal": true }}
    >
      <ModalHeader tag="h2" toggle={resetForm}>
        <span id="add-role-title">Add New Role</span>
      </ModalHeader>
      <ModalBody>
        <form onSubmit={handleAssignRole}>
          <p>Both fields are required.</p>
          <div className="mb-3">
            <label htmlFor="role" className="form-label">
              Role
            </label>
            <select
              id="role"
              required
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
              Email or Kerberos
            </label>
            <input
              type="text"
              id="email"
              required
              className="form-control"
              placeholder="Enter Email or Kerberos"
              value={email}
              onChange={handleEmailChange}
            />
          </div>

          {error && (
            <div role="alert" className="alert alert-danger">
              {error}
            </div>
          )}
          <div className="text-end">
            <FinButton type="submit" disabled={addUserMutation.isPending}>
              {addUserMutation.isPending
                ? "Assigning Role..."
                : "Assign Role to User"}
            </FinButton>
          </div>
        </form>
      </ModalBody>
    </Modal>
  );
};
