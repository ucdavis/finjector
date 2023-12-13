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

namespace Finjector.Web.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ChartsController : ControllerBase
{
    private readonly IAggieEnterpriseService _aggieEnterpriseService;
    private readonly AppDbContext _dbContext;
    private readonly IIdentityService _identityService;
    private readonly ICheckUser _checkUser;
    private readonly IUserService _userService;

    public ChartsController(AppDbContext dbContext, IIdentityService identityService, ICheckUser checkUser,
        IUserService userService, IAggieEnterpriseService aggieEnterpriseService)
    {
        _dbContext = dbContext;
        _identityService = identityService;
        _checkUser = checkUser;
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

        // get any chart that belongs to the user's folders or teams.  role doesn't matter. nested group under team and folder
        var charts = await _dbContext.Coas.Include(c => c.Folder).ThenInclude(f => f.Team).Where(c =>
                c.Folder.FolderPermissions.Any(fp => fp.User.Iam == iamId) ||
                c.Folder.Team.TeamPermissions.Any(tp => tp.User.Iam == iamId))
            .ToListAsync();


        var groupedCharts = charts.GroupBy(c => c.Folder.Team)
            .Select(g => new
            {
                Team = new
                {
                    g.Key.Id,
                    g.Key.Name
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
            }).ToList();


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

        // make sure user exists in the db
        await _userService.EnsureUserExists(iamId);

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

        // TODO: do we want to update the coa detail here?  do an extra query for up to date info?  send more from the client?
        var coaDetail = await _dbContext.CoaDetails.SingleOrDefaultAsync(cd => cd.Id == chartViewModel.SegmentString);

        if (coaDetail == null)
        {
            coaDetail = chartViewModel.SegmentString.ToCoADetail();

            await _dbContext.CoaDetails.AddAsync(coaDetail);
        }

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

    [HttpGet("detail")]
    public async Task<IActionResult> Details(string segmentString)
    {
        var rtValue = await _aggieEnterpriseService.GetAeDetailsAsync(segmentString);

        return Ok(rtValue);
    }
}