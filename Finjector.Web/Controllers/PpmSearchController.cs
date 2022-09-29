using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using AggieEnterpriseApi;
using AggieEnterpriseApi.Extensions;

using Finjector.Web.Models;

namespace Finjector.Web.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PpmSearchController : ControllerBase
{
    public PpmSearchController()
    {
    }

    [HttpGet("project")]
    public async Task<IActionResult> Project(string query)
    {
        // TODO: update AE API to include search for each type

        var client = AggieEnterpriseApi.GraphQlClient.Get(url, token);

        var filter = new PpmProjectFilterInput { Name = new StringFilterInput { Contains = query } };

        var result = await client.PpmProjectSearch.ExecuteAsync(filter, query);

        var data = result.ReadData();

        var projects = data.PpmProjectSearch.Data.Select(d => new SearchResult(d.ProjectNumber, d.Name));

        if (data.PpmProjectByNumber != null)
        {
            projects = projects.Append(new SearchResult(data.PpmProjectByNumber.ProjectNumber, data.PpmProjectByNumber.Name));
        }

        return Ok(projects.DistinctBy(p => p.Code));
    }
}