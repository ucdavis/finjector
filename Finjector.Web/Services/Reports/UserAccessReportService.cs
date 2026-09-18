using Finjector.Core.Domain;
using Finjector.Web.Models.Reports;

namespace Finjector.Web.Services.Reports;

public static class UserAccessReportService
{
    public static IQueryable<UserAccessReportRow> BuildQuery(
        IQueryable<Team> teams,
        IQueryable<Folder> folders,
        string iamId,
        int? teamId = null,
        int? folderId = null)
    {
        var hasIdentity = !string.IsNullOrWhiteSpace(iamId);
        var administeredTeams = teams.Where(t => hasIdentity && t.IsActive &&
            t.TeamPermissions.Any(p => p.User.Iam == iamId && p.Role.Name == Role.Codes.Admin));

        var administeredFolders = folders.Where(f => hasIdentity && f.IsActive && f.Team.IsActive &&
            (f.FolderPermissions.Any(p => p.User.Iam == iamId && p.Role.Name == Role.Codes.Admin) ||
             f.Team.TeamPermissions.Any(p => p.User.Iam == iamId && p.Role.Name == Role.Codes.Admin)));

        if (teamId.HasValue)
        {
            administeredTeams = administeredTeams.Where(t => t.Id == teamId.Value);
            administeredFolders = administeredFolders.Where(f => f.TeamId == teamId.Value);
        }

        if (folderId.HasValue)
        {
            // Folder reports include parent-team grants only as inherited folder access.
            administeredTeams = administeredTeams.Where(t => false);
            administeredFolders = administeredFolders.Where(f => f.Id == folderId.Value);
        }

        var teamPermissions = administeredTeams.SelectMany(t => t.TeamPermissions, (t, p) =>
            new UserAccessReportRow
            {
                TeamId = t.Id,
                TeamName = t.Name,
                FolderId = (int?)null,
                FolderName = (string?)null,
                UserId = p.UserId,
                UserName = p.User.FirstName + " " + p.User.LastName,
                UserEmail = p.User.Email,
                RoleName = p.Role.Name,
                PermissionSource = "Team"
            });

        var folderPermissions = administeredFolders.SelectMany(f => f.FolderPermissions, (f, p) =>
            new UserAccessReportRow
            {
                TeamId = f.TeamId,
                TeamName = f.Team.Name,
                FolderId = (int?)f.Id,
                FolderName = f.Name,
                UserId = p.UserId,
                UserName = p.User.FirstName + " " + p.User.LastName,
                UserEmail = p.User.Email,
                RoleName = p.Role.Name,
                PermissionSource = "Folder"
            });

        var inheritedPermissions = administeredFolders.SelectMany(f => f.Team.TeamPermissions, (f, p) =>
            new UserAccessReportRow
            {
                TeamId = f.TeamId,
                TeamName = f.Team.Name,
                FolderId = (int?)f.Id,
                FolderName = f.Name,
                UserId = p.UserId,
                UserName = p.User.FirstName + " " + p.User.LastName,
                UserEmail = p.User.Email,
                RoleName = p.Role.Name,
                PermissionSource = "Inherited from team"
            });

        return teamPermissions.Concat(folderPermissions).Concat(inheritedPermissions)
            .OrderBy(p => p.TeamName).ThenBy(p => p.TeamId)
            .ThenBy(p => p.FolderId).ThenBy(p => p.FolderName)
            .ThenBy(p => p.UserName).ThenBy(p => p.UserId)
            .ThenBy(p => p.PermissionSource).ThenBy(p => p.RoleName);
    }
}
