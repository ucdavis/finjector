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

    private const string TeamResourceType = "team";

    public UserController(IHttpContextAccessor httpContextAccessor, AppDbContext dbContext, IUserService userService)
    {
        _httpContextAccessor = httpContextAccessor;
        _dbContext = dbContext;
        _userService = userService;
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

        var hasEditPermission = string.Equals(TeamResourceType, type, StringComparison.OrdinalIgnoreCase)
            ? await _userService.VerifyFolderAccess(id, iamId, Role.Codes.Edit)
            : await _userService.VerifyChartAccess(id, iamId, Role.Codes.Edit);

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
}

public class PermissionsModel
{
    public string? RoleName { get; set; }
    public string? ResourceName { get; set; }
    public string? UserName { get; set; }
    public string? UserEmail { get; set; }
}