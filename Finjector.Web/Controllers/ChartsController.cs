using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

using Finjector.Web.Models;
using Finjector.Core.Services;
using Finjector.Core.Models;
using Finjector.Web.Handlers;
using Finjector.Core.Data;
using Microsoft.EntityFrameworkCore;

namespace Finjector.Web.Controllers;


[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ChartsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ICosmosDbService _cosmosDbService;
    private readonly IIdentityService _identityService;
    private readonly ICheckUser _checkUser;
    public const string IamIdClaimType = "ucdPersonIAMID";



    public ChartsController(AppDbContext context, ICosmosDbService cosmosDbService, IIdentityService identityService, ICheckUser checkUser)
    {
        _context = context;
        _cosmosDbService = cosmosDbService;
        _identityService = identityService;
        _checkUser = checkUser;
    }

    // fetch by id
    [HttpGet("{id}")]
    public async Task<IActionResult> GetChart(string id)
    {
        var iamId = Request.HttpContext.User.FindFirstValue(IamIdClaimFallbackTransformer.ClaimType);

        if (iamId == null)
        {
            return Unauthorized();
        }

        var chart = await _cosmosDbService.GetChart(id, iamId);

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

        await _checkUser.UpdateUser(user);
        user = await _context.Users.SingleAsync(a => a.Iam == iamId);

        var charts = await _cosmosDbService.GetCharts(iamId);


        await _checkUser.UpdateCharts(user, charts); //Just put here to populate my charts into the COas

        var teamsAccess = await _context.TeamPermissions.Include(a => a.Team).ThenInclude(a => a.Folders).ThenInclude(a => a.Coas).Where(a => a.UserId == user.Id).ToListAsync();
        var foldersAccess = await _context.FolderPermissions.Include(a => a.Folder).ThenInclude(a => a.Coas).Where(a => a.UserId == user.Id).ToListAsync();

        //select all the coas out of the teamAccess
        var coas = teamsAccess.SelectMany(a => a.Team.Folders).SelectMany(a => a.Coas).ToList();
        var fcoas = foldersAccess.SelectMany(a => a.Folder.Coas).ToList();

        coas.AddRange(fcoas);
        coas = coas.Distinct().ToList();

        charts = coas.Select(a => new Chart() { ChartType = a.ChartType, DisplayName = a.Name, Id = a.Id.ToString(), SegmentString = a.SegmentString, IamId = iamId }).ToList();



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

        var chart = new Chart()
        {
            Id = chartViewModel.Id,
            IamId = iamId,
            SegmentString = chartViewModel.SegmentString,
            DisplayName = chartViewModel.DisplayName,
            ChartType = chartViewModel.ChartType,
        };

        await _cosmosDbService.AddOrUpdateChart(chart);

        return Ok();
    }

    [HttpDelete("delete/{id}")]
    public async Task<IActionResult> DeleteChart(string id)
    {
        var iamId = Request.HttpContext.User.FindFirstValue(IamIdClaimFallbackTransformer.ClaimType);

        if (iamId == null)
        {
            return Unauthorized();
        }

        await _cosmosDbService.DeleteChart(id, iamId);

        return Ok();
    }
}