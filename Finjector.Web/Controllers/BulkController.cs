using AggieEnterpriseApi.Validation;
using Finjector.Core.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace Finjector.Web.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class BulkController : ControllerBase
    {
        public BulkController(IAggieEnterpriseService aggieEnterpriseService)
        {
            _aggieEnterpriseService = aggieEnterpriseService;
        }

        private readonly IAggieEnterpriseService _aggieEnterpriseService;

        [HttpPost]
        public async Task<IActionResult> Validate(string chartStrings)
        {
            // parse chartStrings into list splitting by comma, spaces, or newlines
            var chartStringList = chartStrings.Split(new[] { ',', ' ', '\r', '\n', '\t' }, StringSplitOptions.RemoveEmptyEntries).Distinct().ToList();

            if (chartStringList.Count == 0)
            {
                return BadRequest("No chart strings provided.");
            }
            if (chartStringList.Count > 200)
            {
                return BadRequest("Too many chart strings provided. Maximum is 200.");
            }

            var tasks = chartStringList.Select(async chartString =>
            {
                var result = new ChartValidationResult
                {
                    ChartString = chartString
                };
                try
                {
                    var chartType = _aggieEnterpriseService.GetChartType(chartString);
                    if (chartType == FinancialChartStringType.Invalid)
                    {
                        result.IsValid = false;
                        result.ErrorMessage = "Invalid chart string format.";
                        return result;
                    }
                    if (chartType == FinancialChartStringType.Gl)
                    {
                        var validationResponse = await _aggieEnterpriseService.GlValidate(chartString);
                        result.IsValid = validationResponse.ValidationResponse.Valid;
                        if (!result.IsValid)
                        {
                            if (validationResponse.ValidationResponse.ErrorMessages != null && validationResponse.ValidationResponse.ErrorMessages.Count > 0)
                            {
                                result.ErrorMessage = string.Join("; ", validationResponse.ValidationResponse.ErrorMessages);
                            }
                            else
                            {
                                result.ErrorMessage = "Invalid GL chart string.";
                            }
                        }
                        else
                        {
                            if (validationResponse.Warnings != null && validationResponse.Warnings.Count > 0)
                            {
                                result.IsWarning = true;
                                result.ErrorMessage = string.Join("; ", validationResponse.Warnings);
                            }
                        }
                        result.IsWarning = true; //For debugging warnings
                        result.ErrorMessage = "Totaly fake warning";
                        return result;
                    }
                    if (chartType == FinancialChartStringType.Ppm)
                    {
                        var validationResponse = await _aggieEnterpriseService.PpmValidate(chartString);
                        result.IsValid = validationResponse.ValidationResponse.Valid;
                        if (!result.IsValid)
                        {
                            if (validationResponse.ValidationResponse.ErrorMessages != null && validationResponse.ValidationResponse.ErrorMessages.Count > 0)
                            {
                                result.ErrorMessage = string.Join("; ", validationResponse.ValidationResponse.ErrorMessages);
                            }
                            else
                            {
                                result.ErrorMessage = "Invalid PPM chart string.";
                            }
                        }
                        else
                        {
                            if (validationResponse.Warnings != null && validationResponse.Warnings.Count > 0)
                            {
                                result.IsWarning = true;
                                result.ErrorMessage = string.Join("; ", validationResponse.Warnings);
                            }
                        }
                        return result;
                    }
                    result.IsValid = false;
                    result.ErrorMessage = "Unknown Error.";
                    return result;

                }
                catch (Exception ex)
                {
                    result.IsValid = false;
                    result.ErrorMessage = "Unknown Error";
                    return result;
                }
            });

            var results = await Task.WhenAll(tasks);

            return Ok(results);
        }

        public class ChartValidationResult
        {
            public string ChartString { get; set; } = string.Empty;
            public bool IsValid { get; set; }

            public bool IsWarning { get; set; }
            public string ErrorMessage { get; set; } = string.Empty;
        }
    }
}
