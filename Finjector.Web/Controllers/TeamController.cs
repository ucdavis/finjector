using Finjector.Core.Data;
using Finjector.Core.Domain;
using Finjector.Core.Services;
using Finjector.Web.Extensions;
using Finjector.Web.Models;
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

        var folderCondition = QueryExtensions.GetFolderCondition(iamId);

        var teamResults = await _dbContext.Teams.Where(t => t.TeamPermissions.Any(tp => tp.User.Iam == iamId
                || t.Folders.Any(f => f.FolderPermissions.Any(fp => fp.User.Iam == iamId))
            ))
            .Select(t => new
            {
                Team = new
                {
                    t.Id,
                    t.Name,
                    t.Description,
                    t.IsPersonal
                },
                FolderCount = t.Folders.AsQueryable().Count(folderCondition),
                Admins = t.TeamPermissions.Select(p => p.User.FirstName + " " + p.User.LastName),
                UniqueUserPermissionCount = t.TeamPermissions.Select(p => p.UserId)
                    .Union(t.Folders.AsQueryable().Where(folderCondition)
                        .SelectMany(f => f.FolderPermissions.Select(p => p.UserId))).Distinct().Count(),
                ChartCount = t.Folders.AsQueryable().Where(folderCondition).SelectMany(f => f.Coas).Count()
            })
            .ToListAsync(
            );

        return Ok(teamResults);
    }

    /// <summary>
    /// Returns the details of a specific team
    /// Includes team info, permissions for that team, as well as some metadata about the folders
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var iamId = Request.GetCurrentUserIamId();

        // make sure they have permission to view the team
        if (await _userService.VerifyFolderWithinTeamAccess(id, iamId, Role.Codes.View) == false)
        {
            return Unauthorized();
        }

        var team = await _dbContext.Teams
            .Select(t => new
            {
                t.Id,
                t.Name,
                t.Description,
                t.IsPersonal,
                MyTeamPermissions = t.TeamPermissions.Where(tp => tp.User.Iam == iamId).Select(p => p.Role.Name)
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
                ChartCount = f.SelectMany(c => c.Coas).Count(),
                FolderMemberCount =
                    f.SelectMany(c => c.FolderPermissions).Count(),
            })
            .ToListAsync();

        return Ok(new { team, folders });
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] NameAndDescriptionModel teamModel)
    {
        var iamId = Request.GetCurrentUserIamId();

        var user = await _dbContext.Users.SingleOrDefaultAsync(u => u.Iam == iamId);

        if (user == null)
        {
            return BadRequest("User not found");
        }

        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        // get admin role
        var adminRole = await _dbContext.Roles.SingleAsync(r => r.Name == Role.Codes.Admin);

        // Create the team
        var team = new Team
        {
            Name = teamModel.Name,
            Description = teamModel.Description,
            IsPersonal = false,
            IsActive = true,
            Owner = user,
            TeamPermissions = new List<TeamPermission>
            {
                new TeamPermission
                {
                    Role = adminRole,
                    User = user
                }
            }
        };

        // Add the team to the database
        _dbContext.Teams.Add(team);
        await _dbContext.SaveChangesAsync();

        return CreatedAtAction(nameof(Get), new { id = team.Id }, team);
    }

    // todo -- update team

    /// <summary>
    /// soft delete a team by setting IsActive to false
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var iamId = Request.GetCurrentUserIamId();

        // make sure they have permission to delete the team
        if (await _userService.VerifyTeamAccess(id, iamId, Role.Codes.Admin) == false)
        {
            return Unauthorized();
        }

        var team = await _dbContext.Teams.SingleOrDefaultAsync(t => t.Id == id);

        if (team == null)
        {
            return NotFound();
        }

        team.IsActive = false;

        await _dbContext.SaveChangesAsync();

        return NoContent();
    }

    /// <summary>
    /// remove your permissions from a team AND any folder within that team
    /// If you are the only admin, just soft delete a team by setting IsActive to false
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    [HttpPost("{id}/Leave")]
    public async Task<IActionResult> Leave(int id)
    {
        var iamId = Request.GetCurrentUserIamId();

        // get team admins
        var teamAdmins = await _dbContext.TeamPermissions
            .Where(tp => tp.TeamId == id && tp.Role.Name == Role.Codes.Admin)
            .Include(teamPermission => teamPermission.User)
            .ToListAsync();

        // if they are the only team admin, then just delete the team
        if (teamAdmins.Count == 1 && teamAdmins[0].User.Iam == iamId)
        {
            var team = await _dbContext.Teams.SingleAsync(t => t.Id == id);

            team.IsActive = false;
        }
        else
        {
            // otherwise, just remove their permissions
            var teamPermission = await _dbContext.TeamPermissions.Where(tp => tp.TeamId == id && tp.User.Iam == iamId)
                .ToListAsync();

            var folderPermissions = await _dbContext.FolderPermissions
                .Where(fp => fp.Folder.TeamId == id && fp.User.Iam == iamId)
                .ToListAsync();

            _dbContext.TeamPermissions.RemoveRange(teamPermission);
            _dbContext.FolderPermissions.RemoveRange(folderPermissions);
        }

        await _dbContext.SaveChangesAsync();

        return NoContent();
    }
}