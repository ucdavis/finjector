import { useState } from "react";
import { NameAndDescriptionModel } from "../../types";
import FinjectorButton from "../Shared/FinjectorButton";

interface Props {
  initialValues?: NameAndDescriptionModel;
  onSubmit: (formData: NameAndDescriptionModel) => void;
}

export default function FormComponent(props: Props) {
  const { initialValues = { name: "", description: "" }, onSubmit } = props;
  const [formData, setFormData] = useState(initialValues);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit(formData);
    setLoading(false);
  };

  return (
    <div className="row">
      <div className="col-md-6">
        <form className="form" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Name:
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
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
              name="description"
              value={formData.description}
              onChange={handleChange}
              maxLength={300}
            />
            <div className="invalid-feedback">
              Please provide a description.
            </div>
          </div>

          <FinjectorButton
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create"}
          </FinjectorButton>
        </form>
      </div>
    </div>
  );
}
