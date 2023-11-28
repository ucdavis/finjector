import React, { useState } from "react";
import { useCreateTeamMutation } from "../../queries/teamQueries";
import { useNavigate } from "react-router-dom";

const CreateTeam: React.FC = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const createTeamMutation = useCreateTeamMutation();

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDescription(event.target.value);
  };

  const handleCreate = () => {
    createTeamMutation.mutate(
      {
        name,
        description,
        id: 0,
        isPersonal: false,
      },
      {
        onSuccess: () => {
          navigate("/teams");
        },
        onError: (err: any) => {
          console.log(err);
        },
      }
    );
  };

  return (
    <div>
      <form className="needs-validation" noValidate>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name:
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={name}
            onChange={handleNameChange}
            required
            maxLength={50}
          />
          <div className="invalid-feedback">Please provide a name.</div>
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description:
          </label>
          <textarea
            className="form-control"
            id="description"
            value={description}
            onChange={handleDescriptionChange}
            maxLength={300}
          />
          <div className="invalid-feedback">Please provide a description.</div>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={handleCreate}
        >
          Create
        </button>
      </form>
    </div>
  );
};

export default CreateTeam;
