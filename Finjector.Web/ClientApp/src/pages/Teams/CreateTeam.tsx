import React from "react";
import { useCreateTeamMutation } from "../../queries/teamQueries";
import { useNavigate } from "react-router-dom";
import { NameAndDescriptionModel } from "../../types";
import NameAndDescriptionForm from "../../components/Teams/NameAndDescriptionForm";
import { BackLinkBar } from "../../components/Shared/BackLinkBar";

const CreateTeam: React.FC = () => {
  const navigate = useNavigate();

  const createTeamMutation = useCreateTeamMutation();

  const handleCreate = async (data: NameAndDescriptionModel) => {
    await createTeamMutation.mutateAsync(
      {
        name: data.name,
        description: data.description,
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
      <BackLinkBar />
      <NameAndDescriptionForm onSubmit={handleCreate} />
    </div>
  );
};

export default CreateTeam;
