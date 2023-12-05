using System.Linq.Expressions;
using Finjector.Core.Domain;

namespace Finjector.Web.Extensions;

public static class QueryExtensions
{
    public static Func<string, Expression<Func<Folder, bool>>> GetFolderCondition = (iamId) => (f =>
            f.FolderPermissions.Any(fp => fp.User.Iam == iamId) || 
            f.Team.TeamPermissions.Any(tp => tp.User.Iam == iamId)
        );
}