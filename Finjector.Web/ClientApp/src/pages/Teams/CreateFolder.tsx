import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import NameAndDescriptionForm from "../../components/Teams/NameAndDescriptionForm";
import { useCreateFolderMutation } from "../../queries/folderQueries";
import { FinQueryStatus, NameAndDescriptionModel } from "../../types";
import PageTitle from "../../components/Shared/Layout/PageTitle";
import addFinToast from "../../components/Shared/LoadingAndErrors/FinToast";
import { useGetTeam } from "../../queries/teamQueries";
import { useFinQueryStatus, useFinQueryStatusHandler } from "../../util/error";
import PageBody from "../../components/Shared/Layout/PageBody";

const CreateFolder: React.FC = () => {
  // get the team id from the url
  const { teamId } = useParams<{ teamId: string }>();

  const teamInfoQuery = useGetTeam(teamId);

  const queryStatus: FinQueryStatus = useFinQueryStatus(teamInfoQuery);

  const navigate = useNavigate();

  const createFolderMutation = useCreateFolderMutation(teamId || "");

  const handleCreate = (data: NameAndDescriptionModel) => {
    createFolderMutation.mutate(
      {
        name: data.name,
        description: data.description,
      },
      {
        onSuccess: () => {
          addFinToast("success", "Folder created successfully.");
          navigate(`/teams/${teamId}`);
        },
        onError: () => {
          //console.log("Error triggered");

          addFinToast("error", "Error creating folder.");
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
            : "Error loading Create folder form"}
        </h4>
        <PageTitle title="Edit Team" />
        <PageBody>{queryStatusComponent}</PageBody>
      </div>
    );

  return (
    <div>
      <h4>{teamInfoQuery.data?.team.name}</h4>
      <PageTitle title="Create New Folder" />
      <NameAndDescriptionForm
        buttonText={(loading) =>
          loading ? "Creating..." : "Create New Folder"
        }
        onSubmit={handleCreate}
        loading={createFolderMutation.isPending}
      />
    </div>
  );
};

export default CreateFolder;
