import React from "react";
import { useGetTeam, useUpdateTeamMutation } from "../../queries/teamQueries";
import { useNavigate, useParams } from "react-router-dom";
import { FinQueryStatus, NameAndDescriptionModel } from "../../types";
import NameAndDescriptionForm from "../../components/Teams/NameAndDescriptionForm";
import PageTitle from "../../components/Shared/Layout/PageTitle";
import { useFinQueryStatus, useFinQueryStatusHandler } from "../../util/error";
import PageBody from "../../components/Shared/Layout/PageBody";
import addFinToast from "../../components/Shared/LoadingAndErrors/FinToast";

const EditTeam: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();

  const navigate = useNavigate();

  const teamInfoQuery = useGetTeam(teamId);

  const queryStatus: FinQueryStatus = useFinQueryStatus(teamInfoQuery);

  const updateTeamMutation = useUpdateTeamMutation(teamId || "");

  const handleCreate = (data: NameAndDescriptionModel) => {
    updateTeamMutation.mutate(
      {
        name: data.name,
        description: data.description,
      },
      {
        onSuccess: () => {
          addFinToast("success", "Team updated successfully.");
          navigate(`/teams/${teamId}`);
        },
        onError: () => {
          addFinToast("error", "Error updating team.");
        },
      }
    );
  };

  const queryStatusComponent = useFinQueryStatusHandler({
    queryStatus,
  });

  if (queryStatusComponent)
    return (
      <div>
        <h4>
          {queryStatus.isLoading
            ? "Scribbling in form details..."
            : "Error loading Edit Team form"}
        </h4>
        <PageTitle title="Edit Team" />
        <PageBody>{queryStatusComponent}</PageBody>
      </div>
    );

  return (
    <div>
      <h4>{teamInfoQuery.data?.team.name}</h4>
      <PageTitle title="Edit Team" />
      <PageBody>
        <NameAndDescriptionForm
          initialValues={{
            name: teamInfoQuery.data?.team.name || "",
            description: teamInfoQuery.data?.team.description,
          }}
          buttonText={(loading) => (loading ? "Saving..." : "Save Changes")}
          onSubmit={handleCreate}
          loading={updateTeamMutation.isPending}
        />
      </PageBody>
    </div>
  );
};

export default EditTeam;
