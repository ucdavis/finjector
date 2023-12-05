import React from "react";
import { useUpdateTeamMutation } from "../../queries/teamQueries";
import { useNavigate, useParams } from "react-router-dom";
import { NameAndDescriptionModel } from "../../types";
import NameAndDescriptionForm from "../../components/Teams/NameAndDescriptionForm";
import { BackLinkBar } from "../../components/Shared/BackLinkBar";
import FinLoader from "../../components/Shared/FinLoader";
import {
  useEditFolderMutation,
  useGetFolder,
} from "../../queries/folderQueries";

const EditFolder: React.FC = () => {
  const { id, folderId } = useParams<{ id: string; folderId: string }>();

  const navigate = useNavigate();

  const folderQuery = useGetFolder(folderId);

  const updateFolderMutation = useEditFolderMutation(id || "", folderId || "");

  const handleCreate = async (data: NameAndDescriptionModel) => {
    await updateFolderMutation.mutateAsync(
      {
        name: data.name,
        description: data.description,
      },
      {
        onSuccess: () => {
          navigate(`/teams/${id}/folders/${folderId}`);
        },
        onError: (err: any) => {
          console.log(err);
        },
      }
    );
  };

  if (folderQuery.isLoading) {
    return <FinLoader />;
  }

  return (
    <div>
      <BackLinkBar />
      <div className="page-title mb-3">
        <h1>Edit Team</h1>
      </div>
      <NameAndDescriptionForm
        initialValues={{
          name: folderQuery.data?.folder.name || "",
          description: folderQuery.data?.folder.description,
        }}
        buttonText={(loading) => (loading ? "Saving..." : "Save Changes")}
        onSubmit={handleCreate}
      />
    </div>
  );
};

export default EditFolder;
