using Finjector.Core.Data;
using Finjector.Core.Services;
using Finjector.Web.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Finjector.Web.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TeamController : ControllerBase
{
    private readonly AppDbContext _dbContext;
    private readonly IUserService _userService;

    public TeamController(AppDbContext dbContext, IUserService userService)
    {
        _dbContext = dbContext;
        _userService = userService;
    }

    /// <summary>
    /// Return all teams belonging to the current user
    /// </summary>
    [HttpGet]
    [HttpGet("mine")]
    public async Task<IActionResult> Mine()
    {
        var iamId = Request.GetCurrentUserIamId();

        var teamResults = await _dbContext.Coas.Where(c =>
                c.Folder.FolderPermissions.Any(fp => fp.User.Iam == iamId) ||
                c.Folder.Team.TeamPermissions.Any(tp => tp.User.Iam == iamId))
            .GroupBy(c => new { c.Folder.Team.Id, c.Folder.Team.Name })
            .Select(tg => new
            {
                Team = tg.Key,
                FolderCount = tg.Select(c => c.Folder.Id).Distinct().Count(),
                Admins = tg.SelectMany(c =>
                    c.Folder.Team.TeamPermissions.Select(p => p.User.FirstName + " " + p.User.LastName)).Distinct(),
                TeamPermissionCount = tg.SelectMany(c => c.Folder.Team.TeamPermissions.Select(p => p.UserId)).Distinct()
                    .Count(),
                FolderPermissionCount = tg.SelectMany(c => c.Folder.FolderPermissions.Select(p => p.UserId)).Distinct()
                    .Count(),
                ChartCount = tg.Count()
            })
            .ToListAsync();

        return Ok(teamResults);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetTeam(int id)
    {
        var iamId = Request.GetCurrentUserIamId();

        var team = await _dbContext.Teams.Include(t => t.TeamPermissions)
            .Select(t => new
            {
                t.Id,
                t.Name,
                Permissions = t.TeamPermissions.Select(p => p.Role.Name)
            })
            .SingleOrDefaultAsync(t => t.Id == id);

        if (team == null)
        {
            return NotFound();
        }

        // get all folders in this team that user has access to, and include count of team members and coas
        var folders = await _dbContext.Folders.Where(f =>
                f.FolderPermissions.Any(fp => fp.User.Iam == iamId) ||
                f.Team.TeamPermissions.Any(tp => tp.User.Iam == iamId))
            .Where(f => f.Team.Id == id)
            .GroupBy(f => new { f.Id, f.Name })
            .Select(f => new
            {
                Folder = f.Key,
                CoaCount = f.SelectMany(c => c.Coas).Count(),
                FolderMemberCount =
                    f.SelectMany(c => c.FolderPermissions).Count(),
            })
            .ToListAsync();

        return Ok(new { team, folders });
    }

    // todo -- get folders for team, including coas

    // todo -- create team

    // todo -- update team

    // todo -- delete team

    // todo -- add user to team

    // todo -- remove user from team
}