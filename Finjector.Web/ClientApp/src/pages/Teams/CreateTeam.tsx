import React from "react";
import { useCreateTeamMutation } from "../../queries/teamQueries";
import { useNavigate } from "react-router-dom";
import { NameAndDescriptionModel } from "../../types";
import NameAndDescriptionForm from "../../components/Teams/NameAndDescriptionForm";
import PageTitle from "../../components/Shared/StyledComponents/PageTitle";

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
      <PageTitle title="Create New Team" />
      <NameAndDescriptionForm
        buttonText={(loading) => (loading ? "Creating..." : "Create New Team")}
        onSubmit={handleCreate}
      />
    </div>
  );
};

export default CreateTeam;
