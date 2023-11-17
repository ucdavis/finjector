using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Finjector.Core.Services;

namespace Finjector.Web.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PpmSearchController : ControllerBase
{
    private IAggieEnterpriseService _aggieEnterpriseService;

    public PpmSearchController(IAggieEnterpriseService aggieEnterpriseService)
    {
        _aggieEnterpriseService = aggieEnterpriseService;
    }

    [HttpGet("project")]
    public async Task<IActionResult> Project(string query)
    {
        return Ok(await _aggieEnterpriseService.PpmProject(query));
    }

    [HttpGet("tasksByProject")]
    public async Task<IActionResult> TasksByProject(string projectNumber)
    {
        var rtValue = await _aggieEnterpriseService.TasksByProject(projectNumber);
        if(rtValue == null)
        {
            return NotFound();
        }

        return Ok(rtValue);
    }

    // Task search is special because we only search within a specific project, given here as "dependency" param
    [HttpGet("task")]
    public async Task<IActionResult> Task(string query, string dependency)
    {
        if (string.IsNullOrEmpty(dependency))
        {
            return BadRequest("Dependency is required");
        }

        var rtValue = await _aggieEnterpriseService.Task(query, dependency);

        if (rtValue == null)
        {
            return NotFound();
        }

        return Ok(rtValue);
    }

    [HttpGet("organization")]
    public async Task<IActionResult> Organization(string query)
    {
        return Ok(await _aggieEnterpriseService.Organization(query));
    }

    [HttpGet("expenditureType")]
    public async Task<IActionResult> ExpenditureType(string query)
    {
        return Ok(await _aggieEnterpriseService.ExpenditureType(query));
    }

    [HttpGet("award")]
    public async Task<IActionResult> Award(string query)
    {
        return Ok(await _aggieEnterpriseService.Award(query));
    }

    [HttpGet("fundingSource")]
    public async Task<IActionResult> FundingSource(string query)
    {
        return Ok(await _aggieEnterpriseService.FundingSource(query));
    }

    [HttpGet("fullstring")]
    public async Task<IActionResult> FullString(string segmentString)
    {    
        return Ok(await _aggieEnterpriseService.PpmValidate(segmentString));
    }

    [HttpGet("validate")]
    public async Task<IActionResult> Validate(string segmentString)
    {
        return Ok(await _aggieEnterpriseService.PpmValidate(segmentString));
    }
}