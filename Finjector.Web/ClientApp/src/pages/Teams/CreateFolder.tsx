import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import NameAndDescriptionForm from "../../components/Teams/NameAndDescriptionForm";
import { useCreateFolderMutation } from "../../queries/folderQueries";
import { NameAndDescriptionModel } from "../../types";
import PageTitle from "../../components/Shared/Layout/PageTitle";
import addFinToast from "../../components/Shared/LoadingAndErrors/FinToast";

const CreateFolder: React.FC = () => {
  // get the team id from the url
  const { teamId } = useParams<{ teamId: string }>();

  const navigate = useNavigate();

  const createFolderMutation = useCreateFolderMutation(teamId || "");

  const handleCreate = async (data: NameAndDescriptionModel) => {
    await createFolderMutation.mutateAsync(
      {
        name: data.name,
        description: data.description,
      },
      {
        onSuccess: () => {
          addFinToast("success", "Folder created successfully.");
          navigate(`/teams/${teamId}`);
        },
        onError: (err: any) => {
          addFinToast("error", "Error creating folder.");
        },
      }
    );
  };

  return (
    <div>
      <PageTitle title="Create New Folder" />
      <NameAndDescriptionForm
        buttonText={(loading) =>
          loading ? "Creating..." : "Create New Folder"
        }
        onSubmit={handleCreate}
      />
    </div>
  );
};

export default CreateFolder;
