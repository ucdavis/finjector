using Finjector.Core.Data;
using Finjector.Core.Domain;
using Microsoft.EntityFrameworkCore;

namespace Finjector.Core.Services;

public interface IUserService
{
    Task<User> EnsureUserExists(string iamId);

    /// <summary>
    /// make sure the user has the ability to access a given CoA
    /// </summary>
    /// <param name="chartId"></param>
    /// <param name="iamId"></param>
    /// <param name="role">Use either edit or view -- admin will be treated like edit in the context of a chart</param>
    /// <returns></returns>
    Task<bool> VerifyChartAccess(int chartId, string iamId, string role);

    /// <summary>
    /// make sure the user has the ability to access a given folder
    /// </summary>
    /// <param name="folderId"></param>
    /// <param name="iamId"></param>
    /// <param name="role">admin > edit > view</param>
    /// <returns></returns>
    Task<bool> VerifyFolderAccess(int folderId, string iamId, string role);

    Task<Folder> GetPersonalFolder(string iamId);

    /// <summary>
    /// make sure the user has the ability to access a given team
    /// </summary>
    /// <param name="teamId"></param>
    /// <param name="iamId"></param>
    /// <param name="role"></param>
    /// <returns></returns>
    Task<bool> VerifyTeamAccess(int teamId, string iamId, string role);

    /// <summary>
    /// make sure the user has the ability to access any folder within a given team, or the team itself
    /// </summary>
    /// <param name="teamId"></param>
    /// <param name="iamId"></param>
    /// <param name="role"></param>
    /// <returns></returns>
    Task<bool> VerifyFolderWithinTeamAccess(int teamId, string iamId, string role);
}

public class UserService : IUserService
{
    private readonly AppDbContext _dbContext;
    private readonly IIdentityService _identityService;

    public UserService(AppDbContext dbContext, IIdentityService identityService)
    {
        _dbContext = dbContext;
        _identityService = identityService;
    }

    public async Task<Folder> GetPersonalFolder(string iamId)
    {
        return await _dbContext.Folders.SingleAsync(f =>
            f.Team.IsPersonal && f.Team.Owner.Iam == iamId && f.IsDefault);
    }

    /// <summary>
    /// make sure the user has the ability to access a given CoA
    /// </summary>
    /// <param name="chartId"></param>
    /// <param name="iamId"></param>
    /// <param name="role">Use either edit or view -- admin will be treated like edit in the context of a chart</param>
    /// <returns></returns>
    public async Task<bool> VerifyChartAccess(int chartId, string iamId, string role)
    {
        // make sure we have valid inputs
        if (string.IsNullOrWhiteSpace(iamId) || string.IsNullOrWhiteSpace(role))
        {
            return false;
        }

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

    /// <summary>
    /// make sure the user has the ability to access a given team
    /// </summary>
    /// <param name="teamId"></param>
    /// <param name="iamId"></param>
    /// <param name="role"></param>
    /// <returns></returns>
    public async Task<bool> VerifyTeamAccess(int teamId, string iamId, string role)
    {
        // make sure we have valid inputs
        if (string.IsNullOrWhiteSpace(iamId) || string.IsNullOrWhiteSpace(role))
        {
            return false;
        }

        if (role == Role.Codes.View)
        {
            // if we are just talking view, then any db role will have access
            return await _dbContext.Teams.AnyAsync(team =>
                team.Id == teamId &&
                team.TeamPermissions.Any(teamPermission => teamPermission.User.Iam == iamId));
        }
        else if (role == Role.Codes.Edit)
        {
            // if we are talking edit, then you need to be an admin or editor 
            return await _dbContext.Teams.AnyAsync(team =>
                team.Id == teamId &&
                team.TeamPermissions.Any(tp =>
                    tp.User.Iam == iamId && (tp.Role.Name == Role.Codes.Admin || tp.Role.Name == Role.Codes.Edit)));
        }
        else if (role == Role.Codes.Admin)
        {
            // for admin, you have to be an admin
            return await _dbContext.Teams.AnyAsync(team =>
                team.Id == teamId &&
                team.TeamPermissions.Any(tp =>
                    tp.User.Iam == iamId && (tp.Role.Name == Role.Codes.Admin)));
        }

        // if we get here, then we don't have a valid role
        return false;
    }

    /// <summary>
    /// make sure the user has the ability to access any folder within a given team, or the team itself
    /// </summary>
    /// <param name="teamId"></param>
    /// <param name="iamId"></param>
    /// <param name="role"></param>
    /// <returns></returns>
    public async Task<bool> VerifyFolderWithinTeamAccess(int teamId, string iamId, string role)
    {
        // make sure we have valid inputs
        if (string.IsNullOrWhiteSpace(iamId) || string.IsNullOrWhiteSpace(role))
        {
            return false;
        }

        if (role == Role.Codes.View)
        {
            // if we are just talking view, then any db role will have access
            return await _dbContext.Teams.AnyAsync(team =>
                team.Id == teamId &&
                (
                    team.Folders.Any(f => f.FolderPermissions.Any(fp => fp.User.Iam == iamId)) ||
                    team.TeamPermissions.Any(teamPermission => teamPermission.User.Iam == iamId)
                )
            );
        }
        else if (role == Role.Codes.Edit)
        {
            // if we are talking edit, then you need to be an admin or editor 
            return await _dbContext.Teams.AnyAsync(team =>
                team.Id == teamId &&
                (
                    team.Folders.Any(f => f.FolderPermissions.Any(fp =>
                        fp.User.Iam == iamId &&
                        (fp.Role.Name == Role.Codes.Admin || fp.Role.Name == Role.Codes.Edit))) ||
                    team.TeamPermissions.Any(tp =>
                        tp.User.Iam == iamId && (tp.Role.Name == Role.Codes.Admin || tp.Role.Name == Role.Codes.Edit))
                )
            );
        }
        else if (role == Role.Codes.Admin)
        {
            // for admin, you have to be an admin
            return await _dbContext.Teams.AnyAsync(team =>
                team.Id == teamId &&
                (
                    team.Folders.Any(f => f.FolderPermissions.Any(fp =>
                        fp.User.Iam == iamId && (fp.Role.Name == Role.Codes.Admin))) ||
                    team.TeamPermissions.Any(tp =>
                        tp.User.Iam == iamId && (tp.Role.Name == Role.Codes.Admin))
                )
            );
        }

        // if we get here, then we don't have a valid role
        return false;
    }

    /// <summary>
    /// make sure the user has the ability to access a given folder
    /// </summary>
    /// <param name="folderId"></param>
    /// <param name="iamId"></param>
    /// <param name="role">admin > edit > view</param>
    /// <returns></returns>
    public async Task<bool> VerifyFolderAccess(int folderId, string iamId, string role)
    {
        // make sure we have valid inputs
        if (string.IsNullOrWhiteSpace(iamId) || string.IsNullOrWhiteSpace(role))
        {
            return false;
        }

        if (role == Role.Codes.View)
        {
            // if we are just talking view, then any db role will have access
            return await _dbContext.Folders.AnyAsync(f =>
                f.Id == folderId &&
                (f.FolderPermissions.Any(fp => fp.User.Iam == iamId) ||
                 f.Team.TeamPermissions.Any(tp => tp.User.Iam == iamId)));
        }
        else if (role == Role.Codes.Edit)
        {
            // if we are talking edit, then you need to be an admin or editor 
            return await _dbContext.Folders.AnyAsync(f =>
                f.Id == folderId &&
                (f.FolderPermissions.Any(fp =>
                     fp.User.Iam == iamId && (fp.Role.Name == Role.Codes.Admin || fp.Role.Name == Role.Codes.Edit)) ||
                 f.Team.TeamPermissions.Any(tp =>
                     tp.User.Iam == iamId && (tp.Role.Name == Role.Codes.Admin || tp.Role.Name == Role.Codes.Edit))));
        }
        else if (role == Role.Codes.Admin)
        {
            // for admin, you have to be an admin
            return await _dbContext.Folders.AnyAsync(f =>
                f.Id == folderId &&
                (f.FolderPermissions.Any(fp =>
                     fp.User.Iam == iamId && (fp.Role.Name == Role.Codes.Admin)) ||
                 f.Team.TeamPermissions.Any(tp =>
                     tp.User.Iam == iamId && (tp.Role.Name == Role.Codes.Admin))));
        }

        // if we get here, then we don't have a valid role
        return false;
    }

    // Ensure the user already exists and has a personal team w/ default folder
    public async Task<User> EnsureUserExists(string iamId)
    {
        await using var transaction = await _dbContext.Database.BeginTransactionAsync();

        try
        {
            // Lookup user inside transaction to ensure atomicity
            var user = await _dbContext.Users.SingleOrDefaultAsync(u => u.Iam == iamId);

            if (user == null)
            {
                // user not found in database, so create them via IAM
                user = await _identityService.GetByIam(iamId);

                // if we still don't have a user, then we can't do anything
                if (user == null)
                {
                    throw new Exception("User not found in IAM with IamID " + iamId);
                }

                // we have a user from IAM, so add them to our database
                await _dbContext.Users.AddAsync(user);

                try
                {
                    await _dbContext.SaveChangesAsync();
                }
                catch (DbUpdateException ex) when (ex.InnerException?.Message.Contains("IX_Users_Iam") == true ||
                                                    ex.InnerException?.Message.Contains("duplicate key") == true)
                {
                    // Handle race condition: another request created the user concurrently
                    // Rollback this transaction and re-query for the user
                    await transaction.RollbackAsync();

                    // Detach the user entity from change tracker to prevent EF from trying to re-insert it
                    // The entity is still in Added state even after rollback, so we must detach it
                    _dbContext.Entry(user).State = EntityState.Detached;

                    // User was created by another request, fetch it
                    user = await _dbContext.Users.SingleOrDefaultAsync(u => u.Iam == iamId);

                    if (user == null)
                    {
                        throw new Exception($"User with IamID {iamId} should exist but was not found after unique constraint violation");
                    }

                    // Start a new transaction for the team creation check
                    await using var newTransaction = await _dbContext.Database.BeginTransactionAsync();

                    try
                    {
                        // Check if user has personal team
                        var existingTeam = await _dbContext.Teams.Where(a => a.Owner.Iam == user.Iam && a.IsPersonal)
                            .SingleOrDefaultAsync();

                        if (existingTeam != null)
                        {
                            await newTransaction.CommitAsync();
                            return user;
                        }

                        // Create personal team if it doesn't exist
                        await CreatePersonalTeamForUser(user);
                        await _dbContext.SaveChangesAsync();
                        await newTransaction.CommitAsync();
                        return user;
                    }
                    catch
                    {
                        await newTransaction.RollbackAsync();
                        throw;
                    }
                }
            }

            // now we have a valid user in the db

            // if user has a personal team, then we are good
            var teams = await _dbContext.Teams.Where(a => a.Owner.Iam == user.Iam && a.IsPersonal)
                .SingleOrDefaultAsync();

            if (teams != null)
            {
                await transaction.CommitAsync();
                return user;
            }

            // user doesn't have a personal team, create one for them
            await CreatePersonalTeamForUser(user);
            await _dbContext.SaveChangesAsync();

            await transaction.CommitAsync();

            return user;
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    private async Task CreatePersonalTeamForUser(User user)
    {
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
            IsDefault = true,
            Team = team
        });

        _dbContext.Teams.Add(team);
    }
}