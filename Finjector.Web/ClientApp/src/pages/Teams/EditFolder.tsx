import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { NameAndDescriptionModel } from "../../types";
import NameAndDescriptionForm from "../../components/Teams/NameAndDescriptionForm";
import FinLoader from "../../components/Shared/FinLoader";
import {
  useEditFolderMutation,
  useGetFolder,
} from "../../queries/folderQueries";
import PageTitle from "../../components/Shared/StyledComponents/PageTitle";

const EditFolder: React.FC = () => {
  const { teamId, folderId } = useParams<{
    teamId: string;
    folderId: string;
  }>();

  const navigate = useNavigate();

  const folderQuery = useGetFolder(folderId);

  const updateFolderMutation = useEditFolderMutation(
    teamId || "",
    folderId || ""
  );

  const handleCreate = async (data: NameAndDescriptionModel) => {
    await updateFolderMutation.mutateAsync(
      {
        name: data.name,
        description: data.description,
      },
      {
        onSuccess: () => {
          navigate(`/teams/${teamId}/folders/${folderId}`);
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
      <PageTitle title="Edit Folder" />
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
