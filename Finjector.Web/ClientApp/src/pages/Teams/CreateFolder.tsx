import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import NameAndDescriptionForm from "../../components/Teams/NameAndDescriptionForm";
import { useCreateFolderMutation } from "../../queries/folderQueries";
import { NameAndDescriptionModel } from "../../types";
import { BackLinkBar } from "../../components/Shared/BackLinkBar";

const CreateFolder: React.FC = () => {
  // get the team id from the url
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();

  const createFolderMutation = useCreateFolderMutation(id || "");

  const handleCreate = async (data: NameAndDescriptionModel) => {
    await createFolderMutation.mutateAsync(
      {
        name: data.name,
        description: data.description,
      },
      {
        onSuccess: () => {
          navigate(`/teams/${id}`);
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
      <div className="page-title mb-3">
        <h1>Create New Folder</h1> {/* in Team Name? -river */}
      </div>
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
