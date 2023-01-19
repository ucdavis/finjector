using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

using Finjector.Web.Models;
using Finjector.Core.Services;
using Finjector.Core.Models;

namespace Finjector.Web.Controllers;


[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ChartsController : ControllerBase
{
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly ICosmosDbService _cosmosDbService;
    public const string IamIdClaimType = "ucdPersonIAMID";

    public ChartsController(IHttpContextAccessor httpContextAccessor, ICosmosDbService cosmosDbService)
    {
        _httpContextAccessor = httpContextAccessor;
        _cosmosDbService = cosmosDbService;
    }

    // fetch by id
    [HttpGet("{id}")]
    public async Task<IActionResult> GetChart(string id)
    {
        var iamId = GetIamId();

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
        var iamId = GetIamId();

        if (iamId == null)
        {
            return Unauthorized();
        }

        var charts = await _cosmosDbService.GetCharts(iamId);

        return Ok(charts);
    }

    [HttpPost("save")]
    public async Task<IActionResult> SaveChart([FromBody] ChartViewModel chartViewModel)
    {
        var iamId = GetIamId();

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
        var iamId = GetIamId();

        if (iamId == null)
        {
            return Unauthorized();
        }

        await _cosmosDbService.DeleteChart(id, iamId);

        return Ok();
    }

    private string? GetIamId()
    {
        var iamId = _httpContextAccessor?.HttpContext?.User.FindFirstValue(IamIdClaimType);
        return iamId;
    }
}