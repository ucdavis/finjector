import { useState } from "react";
import { NameAndDescriptionModel } from "../../types";
import FinButton from "../Shared/FinButton";

interface Props {
  initialValues?: NameAndDescriptionModel;
  buttonText: (loading: boolean) => string;
  onSubmit: (formData: NameAndDescriptionModel) => void;
  loading: boolean;
}

const NameAndDescriptionForm: React.FC<Props> = ({
  initialValues = { name: "", description: "" },
  buttonText,
  onSubmit,
  loading,
}) => {
  const [formData, setFormData] = useState(initialValues);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <div className="row">
      <div className="col-md-7">
        <form className="form" onSubmit={handleSubmit}>
          <div className="mb-4">
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

          <div className="mb-4">
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

          <FinButton type="submit" margin={false} disabled={loading}>
            {buttonText(loading ?? false)}
          </FinButton>
        </form>
      </div>
    </div>
  );
};

export default NameAndDescriptionForm;
