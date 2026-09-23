import { PermissionType } from "../../types";

export interface UserAccessReportRow {
  teamId: number;
  teamName: string;
  folderId: number | null;
  folderName: string | null;
  userId: number;
  userName: string;
  userEmail: string;
  roleName: PermissionType;
  permissionSource: "Team" | "Folder" | "Inherited from team";
}
