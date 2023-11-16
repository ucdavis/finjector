using Finjector.Core.Models;
using Finjector.Core.Extensions;
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
        Task<IEnumerable<SearchResult>> Entity(string query);
        Task<IEnumerable<SearchResult>> Fund(string query);
        Task<IEnumerable<SearchResult>> Department(string query);
        Task<IEnumerable<SearchResult>> Purpose(string query);
        Task<IEnumerable<SearchResult>> Account(string query);
        Task<IEnumerable<SearchResult>> Project(string query);
        Task<IEnumerable<SearchResult>> Program(string query);
        Task<IEnumerable<SearchResult>> Activity(string query);
        Task<IGlValidateChartstring_GlValidateChartstring> Validate(string segmentString);
    }

    public class AggieEnterpriseService : IAggieEnterpriseService
    {
        private readonly FinancialOptions _financialOptions;
        private IAggieEnterpriseClient _apiClient;
        private const string FiscalOfficer = "Fiscal Officer Approver";

        public AggieEnterpriseService(IOptions<FinancialOptions> options)
        {
            _financialOptions = options.Value;
            _apiClient = GraphQlClient.Get(_financialOptions.ApiUrl!, _financialOptions.TokenEndpoint!, _financialOptions.ConsumerKey!, _financialOptions.ConsumerSecret!, $"{_financialOptions.ScopeApp}-{_financialOptions.ScopeEnv}");
        }

        public async Task<AeDetails> GetAeDetailsAsync(string segmentString)
        {
            AeDetails aeDetails = new AeDetails();
            aeDetails.ChartStringType = string.IsNullOrEmpty(segmentString) ? FinancialChartStringType.Invalid : GetChartType(segmentString);
            aeDetails.ChartType = aeDetails.ChartStringType.ToString().ToUpper();
            if(aeDetails.ChartStringType == FinancialChartStringType.Invalid)
            {
                aeDetails.Errors.Add("Invalid Chart Type");
                aeDetails.IsValid = false;
                return aeDetails;
            }

            if(aeDetails.ChartStringType == FinancialChartStringType.Gl)
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
                if(data == null)
                {
                    aeDetails.Errors.Add("Unable to get data from Aggie Enterprise");
                    aeDetails.IsValid = false;
                    return aeDetails;
                }

                aeDetails.IsValid = data.GlValidateChartstring.ValidationResponse.Valid;
                if(!aeDetails.IsValid && data.GlValidateChartstring.ValidationResponse.ErrorMessages != null)
                {
                    foreach(var error in data.GlValidateChartstring.ValidationResponse.ErrorMessages)
                    {
                        aeDetails.Errors.Add(error);
                    }
                }

                if(data.GlValidateChartstring.Warnings != null)
                {
                    foreach(var warning in data.GlValidateChartstring.Warnings)
                    {
                        aeDetails.Warnings.Add($"{warning.SegmentName} - {warning.Warning}");
                    }
                }

                aeDetails.SegmentDetails.Add(new SegmentDetails
                {
                    Order  = 1,
                    Entity = "Entity",
                    Code   = data.ErpEntity?.Code,
                    Name   = data.ErpEntity?.Name
                });
                aeDetails.SegmentDetails.Add(new SegmentDetails
                {
                    Order  = 2,
                    Entity = "Fund",
                    Code   = data.ErpFund?.Code,
                    Name   = data.ErpFund?.Name
                });
                aeDetails.SegmentDetails.Add(new SegmentDetails
                {
                    Order  = 3,
                    Entity = "Department",
                    Code   = data.ErpFinancialDepartment?.Code,
                    Name   = data.ErpFinancialDepartment?.Name
                });
                aeDetails.SegmentDetails.Add(new SegmentDetails
                {
                    Order  = 4,
                    Entity = "Account",
                    Code   = data.ErpAccount?.Code,
                    Name   = data.ErpAccount?.Name
                });
                aeDetails.SegmentDetails.Add(new SegmentDetails
                {
                    Order  = 5,
                    Entity = "Purpose",
                    Code   = data.ErpPurpose?.Code,
                    Name   = data.ErpPurpose?.Name
                });
                aeDetails.SegmentDetails.Add(new SegmentDetails
                {
                    Order  = 6,
                    Entity = "Program",
                    Code   = data.ErpProgram?.Code,
                    Name   = data.ErpProgram?.Name
                });
                aeDetails.SegmentDetails.Add(new SegmentDetails
                {
                    Order  = 7,
                    Entity = "Project",
                    Code   = data.ErpProject?.Code,
                    Name   = data.ErpProject?.Name
                });
                aeDetails.SegmentDetails.Add(new SegmentDetails
                {
                    Order  = 8,
                    Entity = "Activity",
                    Code   = data.ErpActivity?.Code,
                    Name   = data.ErpActivity?.Name
                });

                if (data.ErpFinancialDepartment != null && data.ErpFinancialDepartment.Approvers != null)
                {
                    foreach (var approver in data.ErpFinancialDepartment.Approvers.Where(a => a.ApproverType == FiscalOfficer))
                    {
                        aeDetails.Approvers.Add(new Approver
                        {
                            FirstName = approver.FirstName,
                            LastName  = approver.LastName,
                            Email     = approver.EmailAddress
                        });
                    }
                }

                return aeDetails;
            }
            if(aeDetails.ChartStringType == FinancialChartStringType.Ppm)
            {
                var ppmSegments = FinancialChartValidation.GetPpmSegments(segmentString);
                var result = await _apiClient.DisplayDetailsPpm.ExecuteAsync(
                    projectNumber: ppmSegments.Project, 
                    projectNumberString: ppmSegments.Project, 
                    segmentString: segmentString, 
                    taskNumber: ppmSegments.Task, 
                    organization: ppmSegments.Organization,
                    expendCode: ppmSegments.ExpenditureType
                    );


                var data = result.ReadData();
                if (data == null)
                {
                    aeDetails.Errors.Add("Unable to get data from Aggie Enterprise");
                    aeDetails.IsValid = false;
                    return aeDetails;
                }


                aeDetails.IsValid = data.PpmSegmentStringValidate.ValidationResponse.Valid;
                if (!aeDetails.IsValid && data.PpmSegmentStringValidate.ValidationResponse.ErrorMessages != null)
                {
                    foreach (var error in data.PpmSegmentStringValidate.ValidationResponse.ErrorMessages)
                    {
                        aeDetails.Errors.Add(error);
                    }
                }
                if (data.PpmSegmentStringValidate.Warnings != null)
                {
                    foreach (var warning in data.PpmSegmentStringValidate.Warnings)
                    {
                        aeDetails.Warnings.Add($"{warning.SegmentName} - {warning.Warning}");
                    }
                }

                if (data.ErpFinancialDepartment != null && data.ErpFinancialDepartment.Approvers != null)
                {
                    foreach (var approver in data.ErpFinancialDepartment.Approvers.Where(a => a.ApproverType == "Fiscal Officer Approver"))
                    {
                        aeDetails.Approvers.Add(new Approver
                        {
                            FirstName = approver.FirstName,
                            LastName  = approver.LastName,
                            Email     = approver.EmailAddress
                        });
                    }
                }

                try
                {
                    if (data.PpmProjectByNumber != null && data.PpmProjectByNumber.PrimaryProjectManagerName != null)
                    {
                        var nameParts = data.PpmProjectByNumber.PrimaryProjectManagerName.Split(' ');

                        aeDetails.PpmProjectManager = new Approver
                        {
                            FirstName = nameParts[0],
                            LastName = nameParts[nameParts.Length - 1],
                            Email = data.PpmProjectByNumber.PrimaryProjectManagerEmail
                        };
                    }
                }
                catch(Exception)
                {
                    aeDetails.Warnings.Add("Unable to get Project Manager");
                    aeDetails.PpmProjectManager = new Approver();
                }

                aeDetails.SegmentDetails.Add(new SegmentDetails
                {
                    Order  = 1,
                    Entity = "Project",
                    Code   = data.PpmProjectByNumber?.ProjectNumber,
                    Name   = data.PpmProjectByNumber?.Name
                });

                aeDetails.SegmentDetails.Add(new SegmentDetails
                {
                    Order  = 2,
                    Entity = "Task",
                    Code   = data.PpmTaskByProjectNumberAndTaskNumber?.TaskNumber,
                    Name   = data.PpmTaskByProjectNumberAndTaskNumber?.Name
                });
                aeDetails.SegmentDetails.Add(new SegmentDetails
                {
                    Order  = 3,
                    Entity = "Organization",
                    Code   = data.ErpFinancialDepartment?.Code,
                    Name   = data.ErpFinancialDepartment?.Name
                });
                aeDetails.SegmentDetails.Add(new SegmentDetails
                {
                    Order  = 4,
                    Entity = "Expenditure Type",
                    Code   = data.PpmExpenditureTypeByCode?.Code,
                    Name   = data.PpmExpenditureTypeByCode?.Name
                });
                aeDetails.SegmentDetails.Add(new SegmentDetails
                {
                    Order  = 5,
                    Entity = "Award",
                    Code   = data.PpmSegmentStringValidate.Segments.Award,
                    Name   = string.Empty
                });
                aeDetails.SegmentDetails.Add(new SegmentDetails
                {
                    Order  = 6,
                    Entity = "Funding Source",
                    Code   = data.PpmSegmentStringValidate.Segments.FundingSource,
                    Name   = string.Empty
                });

                var entity   = data.PpmProjectByNumber?.LegalEntityCode ?? "0000";
                var fund     = data.PpmTaskByProjectNumberAndTaskNumber?.GlPostingFundCode ?? "00000";
                var dept     = data.ErpFinancialDepartment?.Code ?? "0000000";
                var account  = data.PpmExpenditureTypeByCode?.Code ?? "000000";
                var purpose  = data.PpmTaskByProjectNumberAndTaskNumber?.GlPostingPurposeCode ?? "00";
                var program  = data.PpmTaskByProjectNumberAndTaskNumber?.GlPostingProgramCode ?? "000";
                var project  = data.PpmProjectByNumber?.ProjectNumber ?? "0000000000";
                var activity = data.PpmTaskByProjectNumberAndTaskNumber?.GlPostingActivityCode ?? "000000";

                aeDetails.PpmGlString = $"{entity}-{fund}-{dept}-{account}-{purpose}-{program}-{project}-{activity}-0000-000000-000000";


                return aeDetails;
            }

            aeDetails.Errors.Add("Unknow Error");
            aeDetails.IsValid = false;
            return aeDetails;
        }

        public FinancialChartStringType GetChartType(string segmentString)
        {
            return FinancialChartValidation.GetFinancialChartStringType(segmentString);
        }

        public async Task<IEnumerable<SearchResult>> Entity(string query)
        {
            var filter = new ErpEntityFilterInput() { Name = new StringFilterInput { Contains = query.ToFuzzyQuery() } };
            var result = await _apiClient.ErpEntitySearch.ExecuteAsync(filter, query.Trim());
            var data = result.ReadData();
            var searchResults = data.ErpEntitySearch.Data.Where(a => a.EligibleForUse)
            .Select(d => new SearchResult(d.Code, d.Name));
            if (data.ErpEntity is { EligibleForUse: true })
            {
                searchResults = searchResults.Append(new SearchResult(data.ErpEntity.Code, data.ErpEntity.Name));
            }
             return  searchResults.DistinctBy(p => p.Code);
        }

        public async Task<IEnumerable<SearchResult>> Fund(string query)
        {
            var filter = new ErpFundFilterInput() { Name = new StringFilterInput { Contains = query.ToFuzzyQuery() } };

            var result = await _apiClient.ErpFundSearch.ExecuteAsync(filter, query.Trim());

            var data = result.ReadData();

            var searchResults = data.ErpFundSearch.Data.Where(a => a.EligibleForUse)
                .Select(d => new SearchResult(d.Code, d.Name));

            if (data.ErpFund is { EligibleForUse: true })
            {
                searchResults = searchResults.Append(new SearchResult(data.ErpFund.Code, data.ErpFund.Name));
            }

            return searchResults.DistinctBy(p => p.Code);
        }

        public async Task<IEnumerable<SearchResult>> Department(string query)
        {
            var filter = new ErpFinancialDepartmentFilterInput()
            { Name = new StringFilterInput { Contains = query.ToFuzzyQuery() } };

            var result = await _apiClient.ErpDepartmentSearch.ExecuteAsync(filter, query.Trim());

            var data = result.ReadData();

            var searchResults = data.ErpFinancialDepartmentSearch.Data.Where(a => a.EligibleForUse)
                .Select(d => new SearchResult(d.Code, d.Name));

            if (data.ErpFinancialDepartment is { EligibleForUse: true })
            {
                searchResults =
                    searchResults.Append(new SearchResult(data.ErpFinancialDepartment.Code,
                        data.ErpFinancialDepartment.Name));
            }

            return searchResults.DistinctBy(p => p.Code);
        }

        public async Task<IEnumerable<SearchResult>> Purpose(string query)
        {
            var filter = new ErpPurposeFilterInput() { Name = new StringFilterInput { Contains = query.ToFuzzyQuery() } };

            var result = await _apiClient.ErpPurposeSearch.ExecuteAsync(filter, query.Trim());

            var data = result.ReadData();

            var searchResults = data.ErpPurposeSearch.Data.Where(a => a.EligibleForUse)
                .Select(d => new SearchResult(d.Code, d.Name));

            if (data.ErpPurpose is { EligibleForUse: true })
            {
                searchResults = searchResults.Append(new SearchResult(data.ErpPurpose.Code, data.ErpPurpose.Name));
            }

            return searchResults.DistinctBy(p => p.Code);
        }

        public async Task<IEnumerable<SearchResult>> Account(string query)
        {
            var filter = new ErpAccountFilterInput() { Name = new StringFilterInput { Contains = query.ToFuzzyQuery() } };

            var result = await _apiClient.ErpAccountSearch.ExecuteAsync(filter, query.Trim());

            var data = result.ReadData();

            var searchResults = data.ErpAccountSearch.Data.Where(a => a.EligibleForUse)
                .Select(d => new SearchResult(d.Code, d.Name));

            if (data.ErpAccount is { EligibleForUse: true })
            {
                searchResults = searchResults.Append(new SearchResult(data.ErpAccount.Code, data.ErpAccount.Name));
            }

            return searchResults.DistinctBy(p => p.Code);
        }

        public async Task<IEnumerable<SearchResult>> Project(string query)
        {
            var filter = new ErpProjectFilterInput() { Name = new StringFilterInput { Contains = query.ToFuzzyQuery() } };

            var result = await _apiClient.ErpProjectSearch.ExecuteAsync(filter, query.Trim());

            var data = result.ReadData();

            var searchResults = data.ErpProjectSearch.Data.Where(a => a.EligibleForUse)
                .Select(d => new SearchResult(d.Code, d.Name));

            if (data.ErpProject is { EligibleForUse: true })
            {
                searchResults = searchResults.Append(new SearchResult(data.ErpProject.Code, data.ErpProject.Name));
            }

            return searchResults.DistinctBy(p => p.Code);
        }

        public async Task<IEnumerable<SearchResult>> Program(string query)
        {
            var filter = new ErpProgramFilterInput() { Name = new StringFilterInput { Contains = query.ToFuzzyQuery() } };

            var result = await _apiClient.ErpProgramSearch.ExecuteAsync(filter, query.Trim());

            var data = result.ReadData();

            var searchResults = data.ErpProgramSearch.Data.Where(a => a.EligibleForUse)
                .Select(d => new SearchResult(d.Code, d.Name));

            if (data.ErpProgram is { EligibleForUse: true })
            {
                searchResults = searchResults.Append(new SearchResult(data.ErpProgram.Code, data.ErpProgram.Name));
            }

            return searchResults.DistinctBy(p => p.Code);
        }

        public async Task<IEnumerable<SearchResult>> Activity(string query)
        {
            var filter = new ErpActivityFilterInput() { Name = new StringFilterInput { Contains = query.ToFuzzyQuery() } };

            var result = await _apiClient.ErpActivitySearch.ExecuteAsync(filter, query.Trim());

            var data = result.ReadData();

            var searchResults = data.ErpActivitySearch.Data.Where(a => a.EligibleForUse)
                .Select(d => new SearchResult(d.Code, d.Name));

            if (data.ErpActivity is { EligibleForUse: true })
            {
                searchResults = searchResults.Append(new SearchResult(data.ErpActivity.Code, data.ErpActivity.Name));
            }

            return searchResults.DistinctBy(p => p.Code);
        }

        public async Task<IGlValidateChartstring_GlValidateChartstring> Validate(string segmentString)
        {
            var result = await _apiClient.GlValidateChartstring.ExecuteAsync(segmentString, true);

            var data = result.ReadData();

            return data.GlValidateChartstring;
        }
    }
}
