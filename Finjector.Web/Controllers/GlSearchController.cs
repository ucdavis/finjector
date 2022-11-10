using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

using AggieEnterpriseApi;
using AggieEnterpriseApi.Extensions;

using Finjector.Web.Models;
using Finjector.Web.Extensions;

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
        var filter = new ErpEntityFilterInput() { Name = new StringFilterInput { Contains = query.ToFuzzyQuery() } };

        var result = await _apiClient.ErpEntitySearch.ExecuteAsync(filter, query);

        var data = result.ReadData();

        var searchResults = data.ErpEntitySearch.Data.Select(d => new SearchResult(d.Code, d.Name));

        if (data.ErpEntity is { EligibleForUse: true })
        {
            searchResults = searchResults.Append(new SearchResult(data.ErpEntity.Code, data.ErpEntity.Name));
        }

        return Ok(searchResults.DistinctBy(p => p.Code));
    }
    
    [HttpGet("fund")]
    public async Task<IActionResult> Fund(string query)
    {
        var filter = new ErpFundFilterInput() { Name = new StringFilterInput { Contains = query.ToFuzzyQuery() } };

        var result = await _apiClient.ErpFundSearch.ExecuteAsync(filter, query);

        var data = result.ReadData();

        var searchResults = data.ErpFundSearch.Data.Select(d => new SearchResult(d.Code, d.Name));

        if (data.ErpFund is { EligibleForUse: true })
        {
            searchResults = searchResults.Append(new SearchResult(data.ErpFund.Code, data.ErpFund.Name));
        }

        return Ok(searchResults.DistinctBy(p => p.Code));
    }
    
    [HttpGet("department")]
    public async Task<IActionResult> Department(string query)
    {
        var filter = new ErpFinancialDepartmentFilterInput() { Name = new StringFilterInput { Contains = query.ToFuzzyQuery() } };

        var result = await _apiClient.ErpDepartmentSearch.ExecuteAsync(filter, query);

        var data = result.ReadData();

        var searchResults = data.ErpFinancialDepartmentSearch.Data.Select(d => new SearchResult(d.Code, d.Name));

        if (data.ErpFinancialDepartment is { EligibleForUse: true })
        {
            searchResults = searchResults.Append(new SearchResult(data.ErpFinancialDepartment.Code, data.ErpFinancialDepartment.Name));
        }

        return Ok(searchResults.DistinctBy(p => p.Code));
    }
    
    [HttpGet("purpose")]
    public async Task<IActionResult> Purpose(string query)
    {
        var filter = new ErpPurposeFilterInput() { Name = new StringFilterInput { Contains = query.ToFuzzyQuery() } };

        var result = await _apiClient.ErpPurposeSearch.ExecuteAsync(filter, query);

        var data = result.ReadData();

        var searchResults = data.ErpPurposeSearch.Data.Select(d => new SearchResult(d.Code, d.Name));

        if (data.ErpPurpose is { EligibleForUse: true })
        {
            searchResults = searchResults.Append(new SearchResult(data.ErpPurpose.Code, data.ErpPurpose.Name));
        }

        return Ok(searchResults.DistinctBy(p => p.Code));
    }
    
    [HttpGet("account")]
    public async Task<IActionResult> Account(string query)
    {
        var filter = new ErpAccountFilterInput() { Name = new StringFilterInput { Contains = query.ToFuzzyQuery() } };

        var result = await _apiClient.ErpAccountSearch.ExecuteAsync(filter, query);

        var data = result.ReadData();

        var searchResults = data.ErpAccountSearch.Data.Select(d => new SearchResult(d.Code, d.Name));

        if (data.ErpAccount is { EligibleForUse: true })
        {
            searchResults = searchResults.Append(new SearchResult(data.ErpAccount.Code, data.ErpAccount.Name));
        }

        return Ok(searchResults.DistinctBy(p => p.Code));
    }
    
    [HttpGet("project")]
    public async Task<IActionResult> Project(string query)
    {
        var filter = new ErpProjectFilterInput() { Name = new StringFilterInput { Contains = query.ToFuzzyQuery() } };

        var result = await _apiClient.ErpProjectSearch.ExecuteAsync(filter, query);

        var data = result.ReadData();

        var searchResults = data.ErpProjectSearch.Data.Select(d => new SearchResult(d.Code, d.Name));

        if (data.ErpProject is { EligibleForUse: true })
        {
            searchResults = searchResults.Append(new SearchResult(data.ErpProject.Code, data.ErpProject.Name));
        }

        return Ok(searchResults.DistinctBy(p => p.Code));
    }
    
        
    [HttpGet("program")]
    public async Task<IActionResult> Program(string query)
    {
        var filter = new ErpProgramFilterInput() { Name = new StringFilterInput { Contains = query.ToFuzzyQuery() } };

        var result = await _apiClient.ErpProgramSearch.ExecuteAsync(filter, query);

        var data = result.ReadData();

        var searchResults = data.ErpProgramSearch.Data.Select(d => new SearchResult(d.Code, d.Name));

        if (data.ErpProgram is { EligibleForUse: true })
        {
            searchResults = searchResults.Append(new SearchResult(data.ErpProgram.Code, data.ErpProgram.Name));
        }

        return Ok(searchResults.DistinctBy(p => p.Code));
    }
    
        
    [HttpGet("activity")]
    public async Task<IActionResult> Activity(string query)
    {
        var filter = new ErpActivityFilterInput() { Name = new StringFilterInput { Contains = query.ToFuzzyQuery() } };

        var result = await _apiClient.ErpActivitySearch.ExecuteAsync(filter, query);

        var data = result.ReadData();

        var searchResults = data.ErpActivitySearch.Data.Select(d => new SearchResult(d.Code, d.Name));

        if (data.ErpActivity is { EligibleForUse: true })
        {
            searchResults = searchResults.Append(new SearchResult(data.ErpActivity.Code, data.ErpActivity.Name));
        }

        return Ok(searchResults.DistinctBy(p => p.Code));
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