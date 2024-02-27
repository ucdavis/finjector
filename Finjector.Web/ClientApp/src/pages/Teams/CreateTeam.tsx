import React from "react";
import { useCreateTeamMutation } from "../../queries/teamQueries";
import { useNavigate } from "react-router-dom";
import { NameAndDescriptionModel } from "../../types";
import NameAndDescriptionForm from "../../components/Teams/NameAndDescriptionForm";
import PageTitle from "../../components/Shared/Layout/PageTitle";
import addFinToast from "../../components/Shared/LoadingAndErrors/FinToast";

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
          addFinToast("success", "Team created successfully.");
          navigate("/teams");
        },
        onError: (err: any) => {
          addFinToast("error", "Error creating team.");
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
        loading={createTeamMutation.isPending}
      />
    </div>
  );
};

export default CreateTeam;
