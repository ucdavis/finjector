using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

using AggieEnterpriseApi;
using AggieEnterpriseApi.Extensions;

using Finjector.Web.Models;

namespace Finjector.Web.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class GlSearchController : ControllerBase
{
    private readonly FinancialOptions _financialOptions;
    private readonly IAggieEnterpriseClient _apiClient;

    public GlSearchController(IOptions<FinancialOptions> options)
    {
        _financialOptions = options.Value;
        _apiClient = AggieEnterpriseApi.GraphQlClient.Get(_financialOptions.ApiUrl!, _financialOptions.ApiToken!);
    }

    [HttpGet("entity")]
    public async Task<IActionResult> Entity(string query)
    {
        var filter = new ErpEntityFilterInput() { Name = new StringFilterInput { Contains = query } };

        var result = await _apiClient.ErpEntitySearch.ExecuteAsync(filter, query);

        var data = result.ReadData();

        var projects = data.ErpEntitySearch.Data.Select(d => new SearchResult(d.Code, d.Name));

        if (data.ErpEntity != null)
        {
            projects = projects.Append(new SearchResult(data.ErpEntity.Code, data.ErpEntity.Name));
        }

        return Ok(projects.DistinctBy(p => p.Code));
    }
    
    [HttpGet("fund")]
    public async Task<IActionResult> Fund(string query)
    {
        var filter = new ErpFundFilterInput() { Name = new StringFilterInput { Contains = query } };

        var result = await _apiClient.ErpFundSearch.ExecuteAsync(filter, query);

        var data = result.ReadData();

        var projects = data.ErpFundSearch.Data.Select(d => new SearchResult(d.Code, d.Name));

        if (data.ErpFund != null)
        {
            projects = projects.Append(new SearchResult(data.ErpFund.Code, data.ErpFund.Name));
        }

        return Ok(projects.DistinctBy(p => p.Code));
    }
    
    // TODO: combine these two validation methods unless we need to get segment names separately
    [HttpGet("fullstring")]
    public async Task<IActionResult> FullString(string segmentString)
    {
        var result = await _apiClient.GlValidateChartstring.ExecuteAsync(segmentString, true);

        var data = result.ReadData();

        // TODO: need to get full segment values from the data        
        return Ok(data.GlValidateChartstring);
    }

    [HttpGet("validate")]
    public async Task<IActionResult> Validate(string segmentString)
    {
        var result = await _apiClient.GlValidateChartstring.ExecuteAsync(segmentString, true);

        var data = result.ReadData();

        return Ok(data.GlValidateChartstring);
    }
}