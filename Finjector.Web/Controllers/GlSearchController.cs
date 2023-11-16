using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Finjector.Core.Services;

namespace Finjector.Web.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class GlSearchController : ControllerBase
{
    private IAggieEnterpriseService _aggieEnterpriseService;

    public GlSearchController(IAggieEnterpriseService aggieEnterpriseService)
    {    
        _aggieEnterpriseService = aggieEnterpriseService;
    }
    [HttpGet("entity")]
    public async Task<IActionResult> Entity(string query)
    {
        return Ok(await _aggieEnterpriseService.Entity(query));
    }
    [HttpGet("fund")]
    public async Task<IActionResult> Fund(string query)
    {
        return Ok(await _aggieEnterpriseService.Fund(query));
    }

    [HttpGet("department")]
    public async Task<IActionResult> Department(string query)
    {
        return Ok(await _aggieEnterpriseService.Department(query));
    }

    [HttpGet("purpose")]
    public async Task<IActionResult> Purpose(string query)
    {
        return Ok(await _aggieEnterpriseService.Purpose(query));
    }

    [HttpGet("account")]
    public async Task<IActionResult> Account(string query)
    {
        return Ok(await _aggieEnterpriseService.Account(query));
    }

    [HttpGet("project")]
    public async Task<IActionResult> Project(string query)
    {
        return Ok(await _aggieEnterpriseService.Project(query));
    }


    [HttpGet("program")]
    public async Task<IActionResult> Program(string query)
    {
        return Ok(await _aggieEnterpriseService.Program(query));
    }


    [HttpGet("activity")]
    public async Task<IActionResult> Activity(string query)
    {
        return Ok(await _aggieEnterpriseService.Activity(query));
    }

    // TODO: combine these two validation methods unless we need to get segment names separately
    [HttpGet("fullstring")]
    public async Task<IActionResult> FullString(string segmentString)
    {
        return Ok(await _aggieEnterpriseService.GlValidate(segmentString));
    }

    [HttpGet("validate")]
    public async Task<IActionResult> Validate(string segmentString)
    {
        return Ok(await _aggieEnterpriseService.GlValidate(segmentString));
    }
}