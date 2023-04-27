using AggieEnterpriseApi;
using AggieEnterpriseApi.Extensions;
using AggieEnterpriseApi.Types;
using Finjector.Web.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace Finjector.Web.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class KfsController : ControllerBase
{
    private readonly FinancialOptions _financialOptions;
    private IAggieEnterpriseClient _apiClient;

    public KfsController(IOptions<FinancialOptions> options)
    {
        _financialOptions = options.Value;
        _apiClient = GraphQlClient.Get(_financialOptions.ApiUrl!, _financialOptions.TokenEndpoint!, _financialOptions.ConsumerKey!, _financialOptions.ConsumerSecret!, $"{_financialOptions.ScopeApp}-{_financialOptions.ScopeEnv}");
    }

    [HttpGet("lookup")]
    public async Task<string> Lookup(string kfsString)
    {
        try
        {
            var parts = kfsString.Split('-');

            var chart = parts[0];
            var accountPart = parts[1];
            var subAcct = parts.Length > 2 ? parts[2] : null;

            var result = await _apiClient.KfsConvertAccount.ExecuteAsync(chart, accountPart, subAcct);
            var data = result.ReadData();
            if (data.KfsConvertAccount.GlSegments != null)
            {
                var tempGlSegments = new GlSegments(data.KfsConvertAccount.GlSegments);

                return tempGlSegments.ToSegmentString();
            }
            if (data.KfsConvertAccount.PpmSegments != null)
            {
                var tempPpmSegments = new PpmSegments(data.KfsConvertAccount.PpmSegments);
                return tempPpmSegments.ToSegmentString();
            }
            return string.Empty;
        }
        catch (Exception)
        {
            return string.Empty;
        }
    }
}
