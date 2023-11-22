using System.ComponentModel.DataAnnotations;
using Finjector.Core.Data;
using Finjector.Core.Domain;
using Finjector.Core.Services;
using Finjector.Web.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
    public IActionResult Info()
    {
        var claims = _httpContextAccessor.HttpContext?.User.Claims;

        if (claims == null)
        {
            return Challenge(); // trigger authentication, but claims should never be null here
        }

        return Ok(claims.ToDictionary(c => c.Type, c => c.Value));
    }

    /// <summary>
    /// get the permissions for a given resource.
    /// Note: folder permissions are just for that folder and do not include inherited permissions from the team
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
            var permissions = await _dbContext.TeamPermissions
                .Where(tp => tp.TeamId == id)
                .Select(tp => new PermissionsModel
                {
                    RoleName = tp.Role.Name,
                    ResourceName = tp.Team.Name,
                    UserName = tp.User.Name,
                    UserEmail = tp.User.Email
                })
                .AsNoTracking()
                .ToArrayAsync();

            return Ok(permissions);
        }
        else
        {
            var permissions = await _dbContext.FolderPermissions
                .Where(fp => fp.FolderId == id)
                .Select(fp => new PermissionsModel
                {
                    RoleName = fp.Role.Name,
                    ResourceName = fp.Folder.Name,
                    UserName = fp.User.Name,
                    UserEmail = fp.User.Email
                })
                .AsNoTracking()
                .ToArrayAsync();

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

        // TODO: find user by email - if they exist, use that user, otherwise create a new user
        var searchUser = await _identityService.GetByEmail(model.Email);

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

            await _dbContext.FolderPermissions.AddAsync(folderPermission);
            await _dbContext.SaveChangesAsync();

            return Ok();
        }
    }

    /// <summary>
    /// only admins can manage permissions
    /// </summary>
    /// <param name="type"></param>
    /// <param name="id"></param>
    /// <param name="iamId"></param>
    /// <returns></returns>
    private async Task<bool> CanManagePermissions(string type, int id, string iamId)
    {
        // only admin permissions can view permissions
        var hasAdminPermissions = string.Equals(TeamResourceType, type, StringComparison.OrdinalIgnoreCase)
            ? await _userService.VerifyFolderAccess(id, iamId, Role.Codes.Admin)
            : await _userService.VerifyChartAccess(id, iamId, Role.Codes.Admin);
        return hasAdminPermissions;
    }
}

public class AddPermissionsModel
{
    [Required] public string Email { get; set; } = "";
    [Required] public string Role { get; set; } = "";
}

public class PermissionsModel
{
    public string? RoleName { get; set; }
    public string? ResourceName { get; set; }
    public string? UserName { get; set; }
    public string? UserEmail { get; set; }
}