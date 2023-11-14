using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

using Finjector.Web.Models;
using Finjector.Core.Services;
using Finjector.Core.Models;
using Finjector.Web.Handlers;

namespace Finjector.Web.Controllers;


[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ChartsController : ControllerBase
{
    private readonly ICosmosDbService _cosmosDbService;
    private readonly IIdentityService _identityService;
    private readonly ICheckUser _checkUser;
    private readonly IAggieEnterpriseService _aggieEnterpriseService;
    public const string IamIdClaimType = "ucdPersonIAMID";



    public ChartsController(ICosmosDbService cosmosDbService, IIdentityService identityService, ICheckUser checkUser, IAggieEnterpriseService aggieEnterpriseService)
    {
        _cosmosDbService = cosmosDbService;
        _identityService = identityService;
        _checkUser = checkUser;
        _aggieEnterpriseService = aggieEnterpriseService;
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

        await _checkUser.UpdateUser(user);

        var charts = await _cosmosDbService.GetCharts(iamId);

        await _checkUser.UpdateCharts(user, charts); //Just put here to populate my charts into the COas

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

    [HttpGet("detail/{id}")]
    public async Task<IActionResult> Details(string id)
    {
        var rtValue = await _aggieEnterpriseService.GetAeDetailsAsync(id);

        return Ok(rtValue);
    }
}