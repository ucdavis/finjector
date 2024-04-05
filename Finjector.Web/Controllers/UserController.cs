using System.ComponentModel.DataAnnotations;
using Finjector.Core.Data;
using Finjector.Core.Domain;
using Finjector.Core.Services;
using Finjector.Web.Extensions;
using Finjector.Web.Handlers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Serilog;

namespace Finjector.Web.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UserController : ControllerBase
{
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly AppDbContext _dbContext;
    private readonly IUserService _userService;
    private readonly IIdentityService _identityService;

    private const string TeamResourceType = "team";

    public UserController(IHttpContextAccessor httpContextAccessor, AppDbContext dbContext, IUserService userService,
        IIdentityService identityService)
    {
        _httpContextAccessor = httpContextAccessor;
        _dbContext = dbContext;
        _userService = userService;
        _identityService = identityService;
    }

    [HttpGet("info")]
    public async Task<IActionResult> Info()
    {
        var claims = _httpContextAccessor.HttpContext?.User.Claims;

        if (claims == null)
        {
            return Challenge(); // trigger authentication, but claims should never be null here
        }

        var dict = claims.ToDictionary(c => c.Type, c => c.Value);

        var iamId = dict.First(a => a.Key == IamIdClaimFallbackTransformer.ClaimType).Value;
        await _userService.EnsureUserExists(iamId);
        

        return Ok(dict);
    }

    /// <summary>
    /// get the permissions for a given resource.
    /// NOTE: if folder, returns permissions for the containing team as well, using the "level" discriminator
    /// </summary>
    /// <param name="type">string value `team` or `folder`. If not "team" defaults to folder.</param>
    /// <param name="id">ID of the team of folder</param>
    /// <returns></returns>
    [HttpGet("permissions/{type}/{id}")]
    public async Task<IActionResult> Permissions(string type, int id)
    {
        var iamId = _httpContextAccessor.HttpContext?.Request.GetCurrentUserIamId();

        if (string.IsNullOrWhiteSpace(iamId))
        {
            return Unauthorized();
        }

        var canManagePermissions = await CanManagePermissions(type, id, iamId);

        if (!canManagePermissions)
        {
            return Unauthorized();
        }

        if (type == TeamResourceType)
        {
            var teamPermissions = await _dbContext.TeamPermissions
                .Where(tp => tp.TeamId == id)
                .Select(tp => new PermissionsModel
                {
                    Level = "team",
                    RoleName = tp.Role.Name,
                    ResourceName = tp.Team.Name,
                    UserName = tp.User.Name,
                    UserEmail = tp.User.Email
                })
                .AsNoTracking()
                .ToArrayAsync();

            return Ok(teamPermissions);
        }
        else
        {
            var teamPermissions = await _dbContext.Folders
                .Where(folder => folder.Id == id)
                .SelectMany(f => f.Team.TeamPermissions)
                .Select(tp => new PermissionsModel
                {
                    Level = "team",
                    RoleName = tp.Role.Name,
                    ResourceName = tp.Team.Name,
                    UserName = tp.User.Name,
                    UserEmail = tp.User.Email
                })
                .AsNoTracking()
                .ToArrayAsync();

            var folderPermissions = await _dbContext.FolderPermissions
                .Where(fp => fp.FolderId == id)
                .Select(fp => new PermissionsModel
                {
                    Level = "folder",
                    RoleName = fp.Role.Name,
                    ResourceName = fp.Folder.Name,
                    UserName = fp.User.Name,
                    UserEmail = fp.User.Email
                })
                .AsNoTracking()
                .ToArrayAsync();

            var permissions = teamPermissions.Concat(folderPermissions)
                .OrderBy(p => p.Level).ThenBy(p => p.UserName).ToArray();

            return Ok(permissions);
        }
    }
    
    /// <summary>
    /// get the admins for a given resource. Can be accessed by anyone who can view the resource, unlike permissions
    /// NOTE: if folder, returns permissions for the containing team as well, using the "level" discriminator
    /// </summary>
    /// <param name="type">string value `team` or `folder`. If not "team" defaults to folder.</param>
    /// <param name="id">ID of the team of folder</param>
    /// <returns></returns>
    [HttpGet("admins/{type}/{id}")]
    public async Task<IActionResult> Admins(string type, int id)
    {
        var iamId = _httpContextAccessor.HttpContext?.Request.GetCurrentUserIamId();

        if (string.IsNullOrWhiteSpace(iamId))
        {
            return Unauthorized();
        }

        var canViewAdmins = await CanViewAdmins(type, id, iamId);

        if (!canViewAdmins)
        {
            return Unauthorized();
        }

        if (type == TeamResourceType)
        {
            var teamPermissions = await _dbContext.TeamPermissions
                .Where(tp => tp.TeamId == id)
                .Select(tp => new PermissionsModel
                {
                    Level = "team",
                    RoleName = tp.Role.Name,
                    ResourceName = tp.Team.Name,
                    UserName = tp.User.Name,
                    UserEmail = tp.User.Email
                })
                .AsNoTracking()
                .ToArrayAsync();

            return Ok(teamPermissions);
        }
        else
        {
            var teamPermissions = await _dbContext.Folders
                .Where(folder => folder.Id == id)
                .SelectMany(f => f.Team.TeamPermissions)
                .Select(tp => new PermissionsModel
                {
                    Level = "team",
                    RoleName = tp.Role.Name,
                    ResourceName = tp.Team.Name,
                    UserName = tp.User.Name,
                    UserEmail = tp.User.Email
                })
                .AsNoTracking()
                .ToArrayAsync();

            var folderPermissions = await _dbContext.FolderPermissions
                .Where(fp => fp.FolderId == id)
                .Select(fp => new PermissionsModel
                {
                    Level = "folder",
                    RoleName = fp.Role.Name,
                    ResourceName = fp.Folder.Name,
                    UserName = fp.User.Name,
                    UserEmail = fp.User.Email
                })
                .AsNoTracking()
                .ToArrayAsync();

            var permissions = teamPermissions.Concat(folderPermissions)
                .OrderBy(p => p.Level).ThenBy(p => p.UserName).ToArray();

            return Ok(permissions);
        }
    }

    /// <summary>
    /// add a permission to a given resource
    /// Ensures a user cannot be added to more than one permission for a given resource
    /// </summary>
    /// <param name="type"></param>
    /// <param name="id"></param>
    /// <param name="model"></param>
    /// <returns></returns>
    /// <exception cref="NotImplementedException"></exception>
    [HttpPost("permissions/{type}/{id}")]
    public async Task<IActionResult> AddPermission(string type, int id, [FromBody] AddPermissionsModel model)
    {
        var iamId = _httpContextAccessor.HttpContext?.Request.GetCurrentUserIamId();

        if (string.IsNullOrWhiteSpace(iamId))
        {
            return Unauthorized();
        }

        if (await CanManagePermissions(type, id, iamId) == false)
        {
            return Unauthorized();
        }

        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        // TODO: find user by email - if they exist, use that user, otherwise create a new user
        var searchUser = await _identityService.GetEmailOrKerb(model.Email);

        if (searchUser == null)
        {
            return BadRequest("User not found");
        }

        var user = await _userService.EnsureUserExists(searchUser.Iam);

        // make sure user is not already in a permission for this resource
        if (string.Equals(TeamResourceType, type, StringComparison.OrdinalIgnoreCase))
        {
            var existingPermission = await _dbContext.TeamPermissions
                .AnyAsync(tp => tp.TeamId == id && tp.UserId == user.Id);

            if (existingPermission)
            {
                return BadRequest("User already has a permission for this resource");
            }
        }
        else
        {
            var existingPermission = await _dbContext.FolderPermissions
                .AnyAsync(fp => fp.FolderId == id && fp.UserId == user.Id);

            if (existingPermission)
            {
                return BadRequest("User already has a permission for this resource");
            }
        }

        // add user to permission for desired role
        if (string.Equals(TeamResourceType, type, StringComparison.OrdinalIgnoreCase))
        {
            var role = await _dbContext.Roles.SingleOrDefaultAsync(r => r.Name == model.Role);

            if (role == null)
            {
                return BadRequest("Role not found");
            }

            var teamPermission = new TeamPermission
            {
                TeamId = id,
                UserId = user.Id,
                RoleId = role.Id
            };

            Log.Information("User {iamId} Adding team permission {@teamPermission} User Added {userId}",iamId , teamPermission, user.Iam);

            await _dbContext.TeamPermissions.AddAsync(teamPermission);
            await _dbContext.SaveChangesAsync();

            return Ok();
        }
        else
        {
            var role = await _dbContext.Roles.SingleOrDefaultAsync(r => r.Name == model.Role);

            if (role == null)
            {
                return BadRequest("Role not found");
            }

            var folderPermission = new FolderPermission
            {
                FolderId = id,
                UserId = user.Id,
                RoleId = role.Id
            };

            Log.Information("User {iamId} Adding folder permission {@folderPermission} User Added {userId}", iamId, folderPermission, user.Iam);

            await _dbContext.FolderPermissions.AddAsync(folderPermission);
            await _dbContext.SaveChangesAsync();

            return Ok();
        }
    }

    /// <summary>
    /// Remove the user from the permission for the given resource
    /// </summary>
    /// <param name="type"></param>
    /// <param name="id"></param>
    /// <param name="model">contains email of user to be removed</param>
    /// <returns></returns>
    [HttpDelete("permissions/{type}/{id}")]
    public async Task<IActionResult> RemovePermission(string type, int id, [FromBody] RemovePermissionsModel model)
    {
        var iamId = _httpContextAccessor.HttpContext?.Request.GetCurrentUserIamId();

        if (string.IsNullOrWhiteSpace(iamId))
        {
            return Unauthorized();
        }

        if (await CanManagePermissions(type, id, iamId) == false)
        {
            return Unauthorized();
        }

        var user = await _dbContext.Users.SingleOrDefaultAsync(u => u.Email == model.Email);

        if (user == null)
        {
            return BadRequest("User not found");
        }

        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (string.Equals(TeamResourceType, type, StringComparison.OrdinalIgnoreCase))
        {
            var teamPermission = await _dbContext.TeamPermissions
                .SingleOrDefaultAsync(tp => tp.TeamId == id && tp.UserId == user.Id);

            if (teamPermission == null)
            {
                return BadRequest("User does not have a permission for this resource");
            }

            Log.Information("User {iamId} Removing team permission {@teamPermission} User Removed {userId}", iamId, teamPermission, user.Iam);

            _dbContext.TeamPermissions.Remove(teamPermission);
            await _dbContext.SaveChangesAsync();

            return Ok();
        }
        else
        {
            var folderPermission = await _dbContext.FolderPermissions
                .SingleOrDefaultAsync(fp => fp.FolderId == id && fp.UserId == user.Id);

            if (folderPermission == null)
            {
                return BadRequest("User does not have a permission for this resource");
            }

            Log.Information("User {iamId} Removing folder permission {@folderPermission} User Removed {userId}", iamId, folderPermission, user.Iam);

            _dbContext.FolderPermissions.Remove(folderPermission);
            await _dbContext.SaveChangesAsync();

            return Ok();
        }
    }

    /// <summary>
    /// only admins can manage permissions
    /// </summary>
    /// <param name="type">team of folder</param>
    /// <param name="id">id of resource</param>
    /// <param name="iamId">iam of user</param>
    /// <returns></returns>
    private async Task<bool> CanManagePermissions(string type, int id, string iamId)
    {
        // only admin permissions can view permissions
        var hasAdminPermissions = string.Equals(TeamResourceType, type, StringComparison.OrdinalIgnoreCase)
            ? await _userService.VerifyTeamAccess(id, iamId, Role.Codes.Admin)
            : await _userService.VerifyFolderAccess(id, iamId, Role.Codes.Admin);
        return hasAdminPermissions;
    }
    
    /// <summary>
    /// anyone with a role can view admins, even if they only have a role in a subfolder
    /// </summary>
    /// <param name="type">team of folder</param>
    /// <param name="id">id of resource</param>
    /// <param name="iamId">iam of user</param>
    /// <returns></returns>
    private async Task<bool> CanViewAdmins(string type, int id, string iamId)
    {
        var access = string.Equals(TeamResourceType, type, StringComparison.OrdinalIgnoreCase)
            ? await _userService.VerifyFolderWithinTeamAccess(id, iamId, Role.Codes.View)
            : await _userService.VerifyFolderAccess(id, iamId, Role.Codes.View);
        return access;
    }
}

public class RemovePermissionsModel
{
    [Required] public string Email { get; set; } = "";
}

public class AddPermissionsModel
{
    [Required] public string Email { get; set; } = "";
    [Required] public string Role { get; set; } = "";
}

public class PermissionsModel
{
    /// <summary>
    /// "team" or "folder"
    /// </summary>
    public string? Level { get; set; }

    public string? RoleName { get; set; }
    public string? ResourceName { get; set; }
    public string? UserName { get; set; }
    public string? UserEmail { get; set; }
}