using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Finjector.Core.Data;
using Finjector.Core.Domain;
using Finjector.Web.Models;
using Finjector.Core.Services;
using Finjector.Core.Extensions;
using Finjector.Web.Handlers;
using Microsoft.EntityFrameworkCore;
using Serilog;

namespace Finjector.Web.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ChartsController : ControllerBase
{
    private readonly IAggieEnterpriseService _aggieEnterpriseService;
    private readonly AppDbContext _dbContext;
    private readonly IIdentityService _identityService;
    private readonly IUserService _userService;

    public ChartsController(AppDbContext dbContext, IIdentityService identityService,
        IUserService userService, IAggieEnterpriseService aggieEnterpriseService)
    {
        _dbContext = dbContext;
        _identityService = identityService;
        _userService = userService;
        _aggieEnterpriseService = aggieEnterpriseService;
    }

    // fetch by id
    [HttpGet("{id}")]
    public async Task<IActionResult> GetChart(int id)
    {
        var iamId = Request.HttpContext.User.FindFirstValue(IamIdClaimFallbackTransformer.ClaimType);

        // verify that user has permission to view this chart
        if (await _userService.VerifyChartAccess(id, iamId, Role.Codes.View) == false)
        {
            return Unauthorized();
        }

        var rtValue = await _dbContext.Coas.Where(c => c.Id == id).Select(ChartStringEditModel.Projection()).SingleOrDefaultAsync();
        if(rtValue == null)
        {
               return NotFound();
        }
        rtValue.CanEdit = await _userService.VerifyChartAccess(id, iamId, Role.Codes.Edit);


        return Ok(rtValue);
    }

    [HttpGet("all")]
    public async Task<IActionResult> AllCharts()
    {
        var iamId = Request.HttpContext.User.FindFirstValue(IamIdClaimFallbackTransformer.ClaimType);

        if (iamId == null)
        {
            return Unauthorized();
        }


        // get any chart that belongs to the user's folders or teams.  role doesn't matter. nested group under team and folder
        var charts = await _dbContext.Coas.Include(c => c.Folder).ThenInclude(f => f.Team).Where(c =>
                c.Folder.FolderPermissions.Any(fp => fp.User.Iam == iamId) ||
                c.Folder.Team.TeamPermissions.Any(tp => tp.User.Iam == iamId))
            .OrderBy(a => a.Name)
            .ToListAsync();


        var groupedCharts = charts.GroupBy(c => c.Folder.Team)
            .Select(g => new
            {
                Team = new
                {
                    g.Key.Id,
                    g.Key.Name,
                    g.Key.IsPersonal
                },
                Folders = g.GroupBy(c => c.Folder)
                    .Select(g2 => new
                    {
                        g2.Key.Id,
                        g2.Key.Name,
                        g2.Key.TeamId,
                        Coas = g2.Select(c => new
                        {
                            c.Id,
                            c.Name,
                            c.ChartType,
                            c.SegmentString,
                            c.Updated
                        }).ToList()
                    })
                    .OrderBy(g2 => g2.Name)
            })
            .OrderByDescending(g => g.Team.IsPersonal)
            .ThenBy(g => g.Team.Name)            
            .ToList();
        
        return Ok(groupedCharts);
    }

    [HttpPost("save")]
    public async Task<IActionResult> SaveChart([FromBody] ChartViewModel chartViewModel)
    {
        var iamId = Request.HttpContext.User.FindFirstValue(IamIdClaimFallbackTransformer.ClaimType);

        if (iamId == null)
        {
            return Unauthorized();
        }

        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        // verify that user has permission to save this chart if it already exists
        if (chartViewModel.Id > 0)
        {
            if (await _userService.VerifyChartAccess(chartViewModel.Id, iamId, Role.Codes.Edit) == false)
            {
                return Unauthorized();
            }
        }
        else if (chartViewModel.FolderId > 0)
        {
            // new chart, make sure they have permission to save in this folder
            if (await _userService.VerifyFolderAccess(chartViewModel.FolderId, iamId, Role.Codes.Edit) == false)
            {
                return Unauthorized();
            }
        }
        else
        {
            // new chart, no folder specified, so just save in the user's default folder
        }

        // use the requested folder if specified, otherwise use the user's default folder
        var folderToUse = chartViewModel.FolderId > 0
            ? await _dbContext.Folders.SingleAsync(f => f.Id == chartViewModel.FolderId)
            : await _userService.GetPersonalFolder(iamId);


        // get the chart or create a new one
        Coa chart;

        if (chartViewModel.Id > 0)
        {
            chart = await _dbContext.Coas.SingleAsync(c => c.Id == chartViewModel.Id);
        }
        else
        {
            chart = new Coa();
            await _dbContext.Coas.AddAsync(chart);
        }

        chart.Folder = folderToUse;
        chart.SegmentString = chartViewModel.SegmentString;
        chart.Name = chartViewModel.Name;
        chart.ChartType = chartViewModel.ChartType;
        chart.Updated = DateTime.UtcNow;
        try
        {
            await _dbContext.SaveChangesAsync();
        } 
        catch (Exception ex)
        {
            //var error = ex.Message;
            Log.Error(ex, "Error saving chart");
            throw;
        }
        return Ok(chart);
    }

    [HttpDelete("delete/{id}")]
    public async Task<IActionResult> DeleteChart(int id)
    {
        var iamId = Request.HttpContext.User.FindFirstValue(IamIdClaimFallbackTransformer.ClaimType);

        // make sure they are allowed to delete this chart
        if (await _userService.VerifyChartAccess(id, iamId, Role.Codes.Edit) == false)
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

        await _dbContext.SaveChangesAsync();

        return Ok();
    }

    // fetch by chart id, when on team/{teamId}/folder/{folderId}/details/{chartId}/{chartString}. requires view permission on chart
    [HttpGet("details/id")]
    public async Task<IActionResult> DetailsById([FromQuery] int chartId)
    {

        var iamId = Request.HttpContext.User.FindFirstValue(IamIdClaimFallbackTransformer.ClaimType);

        // verify that user has permission to view this chart
        if (await _userService.VerifyChartAccess(chartId, iamId, Role.Codes.View) == false)
        {
            return Unauthorized();
        }

        var chartStringDetails = await _dbContext.Coas.Where(c => c.Id == chartId).Select(ChartStringEditModel.Projection()).AsNoTracking().SingleOrDefaultAsync();

        if (chartStringDetails == null)
        {
            return NotFound();
        }

        chartStringDetails.CanEdit = await _userService.VerifyChartAccess(chartId, iamId, Role.Codes.Edit);

        var aeDetails = await _aggieEnterpriseService.GetAeDetailsAsync(chartStringDetails.SegmentString);
        
        var rtValue = new {
            chartStringDetails,
            aeDetails
        };   

        return Ok(rtValue);
    }

    // fetch by chart string, when on /details/{chartString}. requires no permissions 
    [HttpGet("details/string")]
    public async Task<IActionResult> DetailsByString([FromQuery] string chartString)
    {
        var aeDetails = await _aggieEnterpriseService.GetAeDetailsAsync(chartString);
        var rtValue = new {
            aeDetails
        };

        return Ok(rtValue);
    }

    
}