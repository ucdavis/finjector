namespace Finjector.Web.Models.Reports;

public class UserAccessReportRow
{
    public int TeamId { get; set; }
    public string TeamName { get; set; } = string.Empty;
    public int? FolderId { get; set; }
    public string? FolderName { get; set; }
    public int UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string UserEmail { get; set; } = string.Empty;
    public string RoleName { get; set; } = string.Empty;
    public string PermissionSource { get; set; } = string.Empty;
}
