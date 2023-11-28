import React from "react";
import { useCreateTeamMutation } from "../../queries/teamQueries";
import { useNavigate } from "react-router-dom";
import NameAndDescriptionForm, {
  NameAndDescriptionFormProps,
} from "../../components/Teams/NameAndDescriptionForm";

const CreateTeam: React.FC = () => {
  const navigate = useNavigate();

  const createTeamMutation = useCreateTeamMutation();

  const handleCreate = async (data: NameAndDescriptionFormProps) => {
    await createTeamMutation.mutateAsync(
      {
        name: data.name,
        description: data.description,
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
      <NameAndDescriptionForm onSubmit={handleCreate} />
    </div>
  );
};

export default CreateTeam;
