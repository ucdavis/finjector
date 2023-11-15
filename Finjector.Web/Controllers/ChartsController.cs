using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Finjector.Core.Data;
using Finjector.Core.Domain;
using Finjector.Web.Models;
using Finjector.Core.Services;
using Finjector.Web.Handlers;
using Microsoft.EntityFrameworkCore;

namespace Finjector.Web.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ChartsController : ControllerBase
{
    private readonly AppDbContext _dbContext;
    private readonly IIdentityService _identityService;
    private readonly ICheckUser _checkUser;

    public ChartsController(AppDbContext dbContext, IIdentityService identityService, ICheckUser checkUser)
    {
        _dbContext = dbContext;
        _identityService = identityService;
        _checkUser = checkUser;
    }

    // fetch by id
    [HttpGet("{id}")]
    public async Task<IActionResult> GetChart(int id)
    {
        var iamId = Request.HttpContext.User.FindFirstValue(IamIdClaimFallbackTransformer.ClaimType);

        if (iamId == null)
        {
            return Unauthorized();
        }
        
        // TODO: verify that user has permission to view this chart

        var chart = await _dbContext.Coas.SingleOrDefaultAsync(c => c.Id == id);

        if (chart == null)
        {
            return NotFound();
        }

        return Ok(chart);
    }

    [HttpGet("all")]
    public async Task<IActionResult> AllCharts()
    {
        var iamId = Request.HttpContext.User.FindFirstValue(IamIdClaimFallbackTransformer.ClaimType);

        if (iamId == null)
        {
            return Unauthorized();
        }

        var user = await _identityService.GetByIam(iamId);
        if (user == null)
        {
            return Unauthorized();
        }

        await _checkUser.MigrateUser(user);
        
        // get any chart that belongs to the user's folders or teams.  role doesn't matter.
        var charts = await _dbContext.Coas.Where(c =>
            c.Folder.FolderPermissions.Any(fp => fp.User.Iam == iamId) ||
            c.Folder.Team.TeamPermissions.Any(tp => tp.User.Iam == iamId)).ToListAsync();
        
        return Ok(charts);
    }

    [HttpPost("save")]
    public async Task<IActionResult> SaveChart([FromBody] ChartViewModel chartViewModel)
    {
        var iamId = Request.HttpContext.User.FindFirstValue(IamIdClaimFallbackTransformer.ClaimType);

        if (iamId == null)
        {
            return Unauthorized();
        }
        
        // TODO: verify that user has permission to save this chart
        
        // TODO: add to team and folder if specified
        
        // TODO: default folder bool?  or just move name into central config?
        // grab user's default folder
        var defaultFolder = await _dbContext.Folders.Where(f => f.Team.IsPersonal && f.Team.Owner.Iam == iamId && f.Name == "Default").SingleOrDefaultAsync();
        
        if (defaultFolder == null)
        {
            // TODO: dynamically create default folder if needed
            return NotFound();
        }
        
        var chart = new Coa()
        {
            Folder = defaultFolder,
            SegmentString = chartViewModel.SegmentString,
            Name = chartViewModel.DisplayName,
            ChartType = chartViewModel.ChartType,
            Updated = DateTime.UtcNow
        };

        await _dbContext.Coas.AddAsync(chart);

        return Ok();
    }

    [HttpDelete("delete/{id}")]
    public async Task<IActionResult> DeleteChart(int id)
    {
        var iamId = Request.HttpContext.User.FindFirstValue(IamIdClaimFallbackTransformer.ClaimType);

        if (iamId == null)
        {
            return Unauthorized();
        }

        // delete coa with id
        var chart = await _dbContext.Coas.SingleOrDefaultAsync(c => c.Id == id);
        
        if (chart == null)
        {
            return NotFound();
        }
        
        _dbContext.Coas.Remove(chart);
        
        return Ok();
    }
}