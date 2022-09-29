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

        var projects = data.PpmProjectSearch.Data.Select(d => new SearchResult(d.ProjectNumber, d.Name));

        if (data.PpmProjectByNumber != null)
        {
            projects = projects.Append(new SearchResult(data.PpmProjectByNumber.ProjectNumber, data.PpmProjectByNumber.Name));
        }

        return Ok(projects.DistinctBy(p => p.Code));
    }
}