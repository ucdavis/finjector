using Finjector.Core.Data;
using Finjector.Core.Domain;
using Microsoft.EntityFrameworkCore;

namespace Finjector.Core.Services;

public interface IUserService
{
    Task EnsureUserExists(User user);

    /// <summary>
    /// make sure the user has the ability to access a given CoA
    /// </summary>
    /// <param name="chartId"></param>
    /// <param name="iamId"></param>
    /// <param name="role">Use either edit or view -- admin will be treated like edit in the context of a chart</param>
    /// <returns></returns>
    Task<bool> VerifyAccess(int chartId, string iamId, string role);
}

public class UserService : IUserService
{
    private readonly AppDbContext _dbContext;

    public UserService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    /// <summary>
    /// make sure the user has the ability to access a given CoA
    /// </summary>
    /// <param name="chartId"></param>
    /// <param name="iamId"></param>
    /// <param name="role">Use either edit or view -- admin will be treated like edit in the context of a chart</param>
    /// <returns></returns>
    public async Task<bool> VerifyAccess(int chartId, string iamId, string role)
    {
        if (role == Role.Codes.View)
        {
            // if we are just talking view, then any db role will have access
            return await _dbContext.Coas.AnyAsync(c =>
                c.Id == chartId &&
                (c.Folder.FolderPermissions.Any(fp => fp.User.Iam == iamId) ||
                 c.Folder.Team.TeamPermissions.Any(tp => tp.User.Iam == iamId)));
        }

        // otherwise we need to see if they are admins or editors
        return await _dbContext.Coas.AnyAsync(c =>
            c.Id == chartId &&
            (c.Folder.FolderPermissions.Any(fp =>
                 fp.User.Iam == iamId && (fp.Role.Name == Role.Codes.Admin || fp.Role.Name == Role.Codes.Edit)) ||
             c.Folder.Team.TeamPermissions.Any(tp =>
                 tp.User.Iam == iamId && (tp.Role.Name == Role.Codes.Admin || tp.Role.Name == Role.Codes.Edit))));
    }

    // Ensure the user already exists and has a personal team w/ default folder
    public async Task EnsureUserExists(User user)
    {
        if (user.Id == 0)
        {
            var userExists = await _dbContext.Users.AnyAsync(u => u.Iam == user.Iam);

            if (!userExists)
            {
                // user not found in database, so add them
                await _dbContext.Users.AddAsync(user);
                await _dbContext.SaveChangesAsync();
            }
        }

        // if user has a personal team, then we are good
        var teams = await _dbContext.Teams.Where(a => a.Owner.Iam == user.Iam && a.IsPersonal).SingleOrDefaultAsync();

        if (teams != null)
        {
            return;
        }

        // user doesn't have a personal team, create one for them
        var team = new Team
        {
            Name = Team.PersonalTeamName,
            Owner = user,
            IsPersonal = true
        };
        team.TeamPermissions.Add(new TeamPermission
        {
            Role = await _dbContext.Roles.SingleAsync(r => r.Name == Role.Codes.Admin),
            User = user
        });
        team.Folders.Add(new Folder
        {
            Name = Folder.DefaultFolderName,
            Team = team
        });

        _dbContext.Users.Add(user);
        _dbContext.Teams.Add(team);
        await _dbContext.SaveChangesAsync();
    }
}