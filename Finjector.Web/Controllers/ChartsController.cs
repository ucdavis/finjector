using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Finjector.Core.Data;
using Finjector.Core.Domain;
using Finjector.Web.Models;
using Finjector.Core.Services;
using Finjector.Web.Extensions;
using Finjector.Web.Handlers;
using Microsoft.EntityFrameworkCore;

namespace Finjector.Web.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ChartsController : ControllerBase
{
    private readonly ICheckUser _checkUser;
    private readonly IAggieEnterpriseService _aggieEnterpriseService;
    private readonly AppDbContext _dbContext;
    private readonly IIdentityService _identityService;

    public ChartsController(AppDbContext dbContext, IIdentityService identityService, ICheckUser checkUser, IAggieEnterpriseService aggieEnterpriseService)
    {
        _dbContext = dbContext;
        _identityService = identityService;
        _checkUser = checkUser;
        _aggieEnterpriseService = aggieEnterpriseService;
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

        //Just to test
        //var rtValue = await _aggieEnterpriseService.GetAeDetailsAsync(chart.SegmentString);

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
        
        // TODO: do we want to update the coa detail here?  do an extra query for up to date info?  send more from the client?
        var coaDetail = await _dbContext.CoaDetails.SingleOrDefaultAsync(cd => cd.Id == chartViewModel.SegmentString);
        
        if (coaDetail == null)
        {
            coaDetail = chartViewModel.SegmentString.ToCoADetail();
            
            await _dbContext.CoaDetails.AddAsync(coaDetail);
        }

        
        // get the chart or create a new one
        Coa chart;

        if (chartViewModel.Id != 0)
        {
            chart = await _dbContext.Coas.SingleAsync(c => c.Id == chartViewModel.Id);
        }
        else
        {
            chart = new Coa();
            await _dbContext.Coas.AddAsync(chart);
        }
        
        chart.Folder = defaultFolder;
        chart.SegmentString = chartViewModel.SegmentString;
        chart.Detail = coaDetail;
        chart.Name = chartViewModel.Name;
        chart.ChartType = chartViewModel.ChartType;
        chart.Updated = DateTime.UtcNow;
        
        await _dbContext.SaveChangesAsync();

        return Ok(chart);
    }

    [HttpDelete("delete/{id}")]
    public async Task<IActionResult> DeleteChart(int id)
    {
        var iamId = Request.HttpContext.User.FindFirstValue(IamIdClaimFallbackTransformer.ClaimType);

        if (iamId == null)
        {
            return Unauthorized();
        }
        
        // TODO: make sure they are allowed to delete this chart

        // delete coa with id
        var chart = await _dbContext.Coas.SingleOrDefaultAsync(c => c.Id == id);
        
        if (chart == null)
        {
            return NotFound();
        }
        
        _dbContext.Coas.Remove(chart);
        
        await _dbContext.SaveChangesAsync();
        
        return Ok();
    }

    [HttpGet("detail/{id}")]
    public async Task<IActionResult> Details(string id)
    {
        var rtValue = await _aggieEnterpriseService.GetAeDetailsAsync(id);

        return Ok(rtValue);
    }
}