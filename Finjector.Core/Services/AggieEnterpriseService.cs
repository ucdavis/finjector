using Finjector.Core.Models;
using Microsoft.Extensions.Options;
using AggieEnterpriseApi;
using AggieEnterpriseApi.Extensions;
using AggieEnterpriseApi.Validation;


namespace Finjector.Core.Services
{
    public interface IAggieEnterpriseService
    {
        //Returns Chart type (includes invalid value)
        FinancialChartStringType GetChartType(string segmentString);

        Task<AeDetails> GetAeDetailsAsync(string segmentString);
    }

    public class AggieEnterpriseService : IAggieEnterpriseService
    {
        private readonly FinancialOptions _financialOptions;
        private IAggieEnterpriseClient _apiClient;

        public AggieEnterpriseService(IOptions<FinancialOptions> options)
        {
            _financialOptions = options.Value;
            _apiClient = GraphQlClient.Get(_financialOptions.ApiUrl!, _financialOptions.TokenEndpoint!, _financialOptions.ConsumerKey!, _financialOptions.ConsumerSecret!, $"{_financialOptions.ScopeApp}-{_financialOptions.ScopeEnv}");
        }

        public async Task<AeDetails> GetAeDetailsAsync(string segmentString)
        {
            AeDetails aeDetails = new AeDetails();
            aeDetails.ChartType = string.IsNullOrEmpty(segmentString) ? FinancialChartStringType.Invalid.ToString() : GetChartType(segmentString).ToString().ToUpper();
            if(aeDetails.ChartType == FinancialChartStringType.Invalid.ToString())
            {
                aeDetails.Errors.Add("Invalid Chart Type");
                aeDetails.IsValid = false;
                return aeDetails;
            }

            if(aeDetails.ChartType == FinancialChartStringType.Gl.ToString().ToUpper())
            {
                var glSegments = FinancialChartValidation.GetGlSegments(segmentString);
                var result = await _apiClient.DisplayDetailsGl.ExecuteAsync(
                    segmentString: segmentString, validateCVRs: true, 
                    project: glSegments.Project, 
                    entity: glSegments.Entity, 
                    fund: glSegments.Fund, 
                    dept: glSegments.Department, 
                    account: glSegments.Account, 
                    purpose: glSegments.Purpose, 
                    program: glSegments.Program, 
                    activity: glSegments.Activity);

                var data = result.ReadData();
            }
            if(aeDetails.ChartType == FinancialChartStringType.Ppm.ToString().ToUpper())
            {
                var ppmSegments = FinancialChartValidation.GetPpmSegments(segmentString);
                var result = await _apiClient.DisplayDetailsPpm.ExecuteAsync(
                    projectNumber: ppmSegments.Project, 
                    projectNumberString: ppmSegments.Project, 
                    segmentString: segmentString, 
                    taskNumber: ppmSegments.Task, 
                    organization: ppmSegments.Organization);

                var data = result.ReadData();
            }

            aeDetails.Errors.Add("Unknow Error");
            aeDetails.IsValid = false;
            return aeDetails;
        }

        public FinancialChartStringType GetChartType(string segmentString)
        {
            return FinancialChartValidation.GetFinancialChartStringType(segmentString);
        }
    }
}
