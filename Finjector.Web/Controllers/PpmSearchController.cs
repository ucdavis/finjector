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
        var filter = new PpmProjectFilterInput { Name = new StringFilterInput { Contains = query.ToFuzzyQuery() } };

        var result = await _apiClient.PpmProjectSearch.ExecuteAsync(filter, query);

        var data = result.ReadData();

        var searchResults = data.PpmProjectSearch.Data.Where(a => a.EligibleForUse)
            .Select(d => new SearchResult(d.ProjectNumber, d.Name));

        if (data.PpmProjectByNumber is { EligibleForUse: true })
        {
            searchResults =
                searchResults.Append(new SearchResult(data.PpmProjectByNumber.ProjectNumber,
                    data.PpmProjectByNumber.Name));
        }

        return Ok(searchResults.DistinctBy(p => p.Code));
    }

    [HttpGet("tasksByProject")]
    public async Task<IActionResult> TasksByProject(string projectNumber)
    {
        var result = await _apiClient.PpmProjectWithTasks.ExecuteAsync(projectNumber);

        var data = result.ReadData();

        if (data.PpmProjectByNumber == null)
        {
            return NotFound();
        }

        if (data.PpmProjectByNumber.Tasks == null)
        {
            return Ok(new SearchResult[] { });
        }

        return Ok(data.PpmProjectByNumber.Tasks.Where(a => a.EligibleForUse)
            .Select(t => new SearchResult(t.TaskNumber, t.Name)));
    }

    // Task search is special because we only search within a specific project, given here as "dependency" param
    [HttpGet("task")]
    public async Task<IActionResult> Task(string query, string dependency)
    {
        if (string.IsNullOrEmpty(dependency))
        {
            return BadRequest("Dependency is required");
        }

        // first, we need to get the project ID from the dependency
        var project = await _apiClient.PpmProjectSearch.ExecuteAsync(
            new PpmProjectFilterInput { ProjectNumber = new StringFilterInput { Eq = dependency } }, dependency);

        var projectData = project.ReadData();

        if (projectData.PpmProjectByNumber == null)
        {
            return NotFound();
        }

        var projectId = projectData.PpmProjectByNumber.Id.ToString();

        // now we can query for tasks related to that project
        var filter = new PpmTaskFilterInput
        {
            TaskNumber = new StringFilterInput { Contains = query.ToFuzzyQuery() },
            ProjectId = new StringFilterInput { Eq = projectId }
        };

        var result = await _apiClient.PpmTaskSearch.ExecuteAsync(filter);

        var data = result.ReadData();

        var tasks = data.PpmTaskSearch.Data.Where(a => a.EligibleForUse)
            .Select(d => new SearchResult(d.TaskNumber, d.Name));

        return Ok(tasks.DistinctBy(p => p.Code));
    }

    [HttpGet("organization")]
    public async Task<IActionResult> Organization(string query)
    {
        var filter = new PpmOrganizationFilterInput
            { Name = new StringFilterInput { Contains = query.ToFuzzyQuery() } };

        var result = await _apiClient.PpmOrganizationSearch.ExecuteAsync(filter, query);

        var data = result.ReadData();

        var orgs = data.PpmOrganizationSearch.Data.Where(a => a.EligibleForUse)
            .Select(d => new SearchResult(d.Code, d.Name));

        if (data.PpmOrganization is { EligibleForUse: true })
        {
            orgs = orgs.Append(new SearchResult(data.PpmOrganization.Code, data.PpmOrganization.Name));
        }

        return Ok(orgs.DistinctBy(p => p.Code));
    }

    [HttpGet("expenditureType")]
    public async Task<IActionResult> ExpenditureType(string query)
    {
        var filter = new PpmExpenditureTypeFilterInput
            { Name = new StringFilterInput { Contains = query.ToFuzzyQuery() } };

        var result = await _apiClient.PpmExpenditureTypeSearch.ExecuteAsync(filter, query);

        var data = result.ReadData();

        var searchResults = data.PpmExpenditureTypeSearch.Data.Where(a => a.EligibleForUse)
            .Select(d => new SearchResult(d.Code, d.Name));

        if (data.PpmExpenditureTypeByCode is { EligibleForUse: true })
        {
            searchResults = searchResults.Append(new SearchResult(data.PpmExpenditureTypeByCode.Code,
                data.PpmExpenditureTypeByCode.Name));
        }

        return Ok(searchResults.DistinctBy(p => p.Code));
    }

    [HttpGet("award")]
    public async Task<IActionResult> Award(string query)
    {
        var filter = new PpmAwardFilterInput() { Name = new StringFilterInput { Contains = query } };

        var result = await _apiClient.PpmAwardSearch.ExecuteAsync(filter, query);

        var data = result.ReadData();

        var searchResults =
            data.PpmAwardSearch.Data.Where(a => a.EligibleForUse).Select(
                d => new SearchResult(d.AwardNumber ?? string.Empty, d.Name ?? string.Empty));

        if (data.PpmAwardByNumber is { EligibleForUse: true })
        {
            searchResults = searchResults.Append(new SearchResult(data.PpmAwardByNumber.AwardNumber ?? string.Empty,
                data.PpmAwardByNumber.Name ?? string.Empty));
        }

        return Ok(searchResults.DistinctBy(p => p.Code));
    }

    [HttpGet("fundingSource")]
    public async Task<IActionResult> FundingSource(string query)
    {
        var filter = new PpmFundingSourceFilterInput()
            { Name = new StringFilterInput { Contains = query.ToFuzzyQuery() } };

        var result = await _apiClient.PpmFundingSourceSearch.ExecuteAsync(filter, query);

        var data = result.ReadData();

        var searchResults =
            data.PpmFundingSourceSearch.Data.Where(a => a.EligibleForUse)
                .Select(d => new SearchResult(d.FundingSourceNumber, d.Name));

        if (data.PpmFundingSourceByNumber is { EligibleForUse: true })
        {
            searchResults = searchResults.Append(new SearchResult(data.PpmFundingSourceByNumber.FundingSourceNumber,
                data.PpmFundingSourceByNumber.Name));
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