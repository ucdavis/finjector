import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FinQueryStatus, NameAndDescriptionModel } from "../../types";
import NameAndDescriptionForm from "../../components/Teams/NameAndDescriptionForm";
import {
  useEditFolderMutation,
  useGetFolder,
} from "../../queries/folderQueries";
import PageTitle from "../../components/Shared/Layout/PageTitle";
import { useFinQueryStatusHandler } from "../../util/error";
import addFinToast from "../../components/Shared/LoadingAndErrors/FinToast";
import PageBody from "../../components/Shared/Layout/PageBody";

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
          addFinToast("success", "Folder updated successfully.");
          navigate(`/teams/${teamId}/folders/${folderId}`);
        },
        onError: (err: any) => {
          addFinToast("error", "Error updating folder.");
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
        <PageBody>{queryStatusComponent}</PageBody>
      </div>
    );

  return (
    <div>
      <h4>{folderQuery.data?.folder.name}</h4>
      <PageTitle title="Edit Folder" />
      <PageBody>
        <NameAndDescriptionForm
          initialValues={{
            name: folderQuery.data?.folder.name || "",
            description: folderQuery.data?.folder.description,
          }}
          buttonText={(loading) => (loading ? "Saving..." : "Save Changes")}
          onSubmit={handleCreate}
          loading={updateFolderMutation.isLoading}
        />
      </PageBody>
    </div>
  );
};

export default EditFolder;
