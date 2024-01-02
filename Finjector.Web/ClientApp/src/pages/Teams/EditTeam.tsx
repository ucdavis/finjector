import React from "react";
import { useGetTeam, useUpdateTeamMutation } from "../../queries/teamQueries";
import { useNavigate, useParams } from "react-router-dom";
import { NameAndDescriptionModel } from "../../types";
import NameAndDescriptionForm from "../../components/Teams/NameAndDescriptionForm";
import FinLoader from "../../components/Shared/FinLoader";

const EditTeam: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();

  const navigate = useNavigate();

  const teamInfo = useGetTeam(teamId);

  const updateTeamMutation = useUpdateTeamMutation(teamId || "");

  const handleCreate = async (data: NameAndDescriptionModel) => {
    await updateTeamMutation.mutateAsync(
      {
        name: data.name,
        description: data.description,
      },
      {
        onSuccess: () => {
          navigate(`/teams/${teamId}`);
        },
        onError: (err: any) => {
          console.log(err);
        },
      }
    );
  };

  if (teamInfo.isLoading) {
    return <FinLoader />;
  }

  return (
    <div>
      <div className="page-title mb-3">
        <h1>Edit Team</h1>
      </div>
      <NameAndDescriptionForm
        initialValues={{
          name: teamInfo.data?.team.name || "",
          description: teamInfo.data?.team.description,
        }}
        buttonText={(loading) => (loading ? "Saving..." : "Save Changes")}
        onSubmit={handleCreate}
      />
    </div>
  );
};

export default EditTeam;
