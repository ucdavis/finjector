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
                Admins = tg.SelectMany(c => c.Folder.Team.TeamPermissions.Select(p => p.User.FirstName + " " + p.User.LastName)).Distinct(),
                TeamPermissionCount = tg.SelectMany(c => c.Folder.Team.TeamPermissions.Select(p => p.UserId)).Distinct().Count(),
                FolderPermissionCount = tg.SelectMany(c => c.Folder.FolderPermissions.Select(p => p.UserId)).Distinct().Count(),
                ChartCount = tg.Count()
            })
            .ToListAsync();
        
        return Ok(teamResults);
    }

    public async Task<IActionResult> Get(int id)
    {
        // todo -- verify that user has permission to view this team
        
        // todo -- return team info
        // todo: include folders, count of charts, and permissions
    }
    
    // todo -- create team
    
    // todo -- update team
    
    // todo -- delete team
    
    // todo -- add user to team
    
    // todo -- remove user from team
}