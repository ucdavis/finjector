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
public class PpmSearchController : ControllerBase
{
    private readonly FinancialOptions _financialOptions;
    private readonly IAggieEnterpriseClient _apiClient;

    public PpmSearchController(IOptions<FinancialOptions> options)
    {
        _financialOptions = options.Value;
        _apiClient = AggieEnterpriseApi.GraphQlClient.Get(_financialOptions.ApiUrl!, _financialOptions.ApiToken!);
    }

    [HttpGet("project")]
    public async Task<IActionResult> Project(string query)
    {
        var filter = new PpmProjectFilterInput { Name = new StringFilterInput { Contains = query } };

        var result = await _apiClient.PpmProjectSearch.ExecuteAsync(filter, query);

        var data = result.ReadData();

        var searchResults = data.PpmProjectSearch.Data.Select(d => new SearchResult(d.ProjectNumber, d.Name));

        if (data.PpmProjectByNumber != null)
        {
            searchResults = searchResults.Append(new SearchResult(data.PpmProjectByNumber.ProjectNumber, data.PpmProjectByNumber.Name));
        }

        return Ok(searchResults.DistinctBy(p => p.Code));
    }


    // TODO: task is special and will need to take the project number into account eventually
    // query will search task name
    [HttpGet("task")]
    public async Task<IActionResult> Task(string query)
    {
        var projectId = "300000008444977";
        var filter = new PpmTaskFilterInput { TaskNumber = new StringFilterInput { Contains = query }, ProjectId = new StringFilterInput { Eq = projectId } };

        var result = await _apiClient.PpmTaskSearch.ExecuteAsync(filter);

        var data = result.ReadData();

        var tasks = data.PpmTaskSearch.Data.Select(d => new SearchResult(d.TaskNumber, d.Name));

        return Ok(tasks.DistinctBy(p => p.Code));
    }

    [HttpGet("organization")]
    public async Task<IActionResult> Organization(string query)
    {
        var filter = new PpmOrganizationFilterInput { Name = new StringFilterInput { Contains = query } };

        var result = await _apiClient.PpmOrganizationSearch.ExecuteAsync(filter, query);

        var data = result.ReadData();

        var orgs = data.PpmOrganizationSearch.Data.Select(d => new SearchResult(d.Code, d.Name));

        if (data.PpmOrganization != null)
        {
            orgs = orgs.Append(new SearchResult(data.PpmOrganization.Code, data.PpmOrganization.Name));
        }

        return Ok(orgs.DistinctBy(p => p.Code));
    }

    [HttpGet("expenditureType")]
    public async Task<IActionResult> ExpenditureType(string query)
    {
        var filter = new PpmExpenditureTypeFilterInput { Name = new StringFilterInput { Contains = query } };

        var result = await _apiClient.PpmExpenditureTypeSearch.ExecuteAsync(filter, query);

        var data = result.ReadData();

        var searchResults = data.PpmExpenditureTypeSearch.Data.Select(d => new SearchResult(d.Code, d.Name));

        if (data.PpmExpenditureTypeByCode != null)
        {
            searchResults = searchResults.Append(new SearchResult(data.PpmExpenditureTypeByCode.Code, data.PpmExpenditureTypeByCode.Name));
        }

        return Ok(searchResults.DistinctBy(p => p.Code));
    }
    
    [HttpGet("award")]
    public async Task<IActionResult> Award(string query)
    {
        var filter = new PpmAwardFilterInput() { Name = new StringFilterInput { Contains = query } };

        var result = await _apiClient.PpmAwardSearch.ExecuteAsync(filter, query);

        var data = result.ReadData();

        var searchResults = data.PpmAwardSearch.Data.Select(d => new SearchResult(d.AwardNumber ?? string.Empty, d.Name ?? string.Empty));

        if (data.PpmAwardByNumber != null)
        {
            searchResults = searchResults.Append(new SearchResult(data.PpmAwardByNumber.AwardNumber ?? string.Empty, data.PpmAwardByNumber.Name ?? string.Empty));
        }

        return Ok(searchResults.DistinctBy(p => p.Code));
    }
    
    [HttpGet("fundingSource")]
    public async Task<IActionResult> FundingSource(string query)
    {
        var filter = new PpmFundingSourceFilterInput() { Name = new StringFilterInput { Contains = query } };

        var result = await _apiClient.PpmFundingSourceSearch.ExecuteAsync(filter, query);

        var data = result.ReadData();

        var searchResults = data.PpmFundingSourceSearch.Data.Select(d => new SearchResult(d.FundingSourceNumber, d.Name));

        if (data.PpmFundingSourceByNumber != null)
        {
            searchResults = searchResults.Append(new SearchResult(data.PpmFundingSourceByNumber.FundingSourceNumber, data.PpmFundingSourceByNumber.Name));
        }

        return Ok(searchResults.DistinctBy(p => p.Code));
    }

    [HttpGet("fullstring")]
    public async Task<IActionResult> FullString(string segmentString)
    {
        var result = await _apiClient.PpmStringSegmentsValidate.ExecuteAsync(segmentString);

        var data = result.ReadData();

        // TODO: need to get full segment values from the data        
        return Ok(data.PpmStringSegmentsValidate);
    }

    [HttpGet("validate")]
    public async Task<IActionResult> Validate(string segmentString)
    {
        var result = await _apiClient.PpmStringSegmentsValidate.ExecuteAsync(segmentString);

        var data = result.ReadData();

        return Ok(data.PpmStringSegmentsValidate);
    }
}