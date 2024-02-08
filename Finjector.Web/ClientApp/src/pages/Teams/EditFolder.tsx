import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FinQueryStatus, NameAndDescriptionModel } from "../../types";
import NameAndDescriptionForm from "../../components/Teams/NameAndDescriptionForm";
import FinLoader from "../../components/Shared/LoadingAndErrors/FinLoader";
import {
  useEditFolderMutation,
  useGetFolder,
} from "../../queries/folderQueries";
import PageTitle from "../../components/Shared/Layout/PageTitle";
import { useFinQueryStatusHandler } from "../../util/error";

const EditFolder: React.FC = () => {
  const { teamId, folderId } = useParams<{
    teamId: string;
    folderId: string;
  }>();

  const navigate = useNavigate();

  const folderQuery = useGetFolder(folderId);

  const queryStatus: FinQueryStatus = {
    isError: folderQuery.isError,
    isInitialLoading: folderQuery.isInitialLoading,
    error: folderQuery.error,
  };

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

  const queryStatusComponent = useFinQueryStatusHandler({
    queryStatus,
  });

  if (queryStatusComponent)
    return (
      <div>
        <PageTitle
          title={
            queryStatus.isInitialLoading
              ? "Scribbling in form..."
              : "Error loading Edit Folder form"
          }
        />
        {queryStatusComponent}
      </div>
    );

  return (
    <div>
      <h4>{folderQuery.data?.folder.name}</h4>
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
