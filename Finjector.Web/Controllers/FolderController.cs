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
public class FolderController : ControllerBase
{
    private readonly AppDbContext _dbContext;
    private readonly IUserService _userService;

    public FolderController(AppDbContext dbContext, IUserService userService)
    {
        _dbContext = dbContext;
        _userService = userService;
    }

    /// <summary>
    /// Get information about a specific folder
    /// Includes folder info, permissions for that folder, as well as some metadata about the charts
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var iamId = Request.GetCurrentUserIamId();

        var folder = await _dbContext.Folders
            .Select(f => new
            {
                f.Id,
                f.Name,
                TeamName = f.Team.Name,
                TeamId = f.Team.Id,
                TeamIsPersonal = f.Team.IsPersonal,
                MyFolderPermissions = f.FolderPermissions.Where(fp => fp.User.Iam == iamId).Select(fp => fp.Role.Name),
                MyTeamPermissions = f.Team.TeamPermissions.Where(tp => tp.User.Iam == iamId).Select(tp => tp.Role.Name),
            })
            .SingleOrDefaultAsync(f => f.Id == id);

        var charts = await _dbContext.Coas.Where(c => c.FolderId == id).ToListAsync();

        return Ok(new { folder, charts });
    }
}