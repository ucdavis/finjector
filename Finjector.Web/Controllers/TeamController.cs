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
public class TeamController : ControllerBase
{
    private readonly AppDbContext _dbContext;

    public TeamController(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    /// <summary>
    /// Return all teams belonging to the current user
    /// </summary>
    [HttpGet]
    [HttpGet("mine")]
    public async Task<IActionResult> Mine()
    {
        var iamId = Request.GetCurrentUserIamId();

        var teamResults = await _dbContext.Teams.Where(t => t.TeamPermissions.Any(tp => tp.User.Iam == iamId
                || t.Folders.Any(f => f.FolderPermissions.Any(fp => fp.User.Iam == iamId))
            ))
            .Select(t => new
            {
                Team = new
                {
                    t.Id,
                    t.Name,
                    t.IsPersonal
                },
                FolderCount = t.Folders.Count,
                Admins = t.TeamPermissions.Select(p => p.User.FirstName + " " + p.User.LastName),
                TeamPermissionCount = t.TeamPermissions.Select(p => p.UserId).Distinct().Count(),
                FolderPermissionCount = t.Folders.SelectMany(f => f.FolderPermissions.Select(p => p.UserId)).Distinct()
                    .Count(),
                ChartCount = t.Folders.SelectMany(f => f.Coas).Count()
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

        var team = await _dbContext.Teams
            .Select(t => new
            {
                t.Id,
                t.Name,
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
    public async Task<IActionResult> Create([FromBody] CreateTeamModel teamModel)
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

    // todo -- delete team
}

public class CreateTeamModel
{
    [Required] [MaxLength(50)] public string Name { get; set; } = string.Empty;
    [MaxLength(300)] public string? Description { get; set; }
}