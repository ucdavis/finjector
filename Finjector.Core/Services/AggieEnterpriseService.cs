﻿using Finjector.Core.Models;
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
        Task<IGlValidateChartstring_GlValidateChartstring> GlValidate(string segmentString);

        Task<IEnumerable<SearchResult>> PpmProject(string query);
        Task<IEnumerable<SearchResult>?> TasksByProject(string projectNumber);
        Task<IEnumerable<SearchResult>?> Task(string query, string dependency);
        Task<IEnumerable<SearchResult>> Organization(string query);
        Task<IEnumerable<SearchResult>> ExpenditureType(string query);
        Task<IEnumerable<SearchResult>> Award(string query);
        Task<IPpmAward_PpmAwardByNumber?> GetAward(string query);
        Task<IEnumerable<SearchResult>> FundingSource(string query);
        Task<IPpmSegmentStringValidate_PpmSegmentStringValidate> PpmValidate(string segmentString);
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
                if (!string.IsNullOrWhiteSpace(data.PpmSegmentStringValidate.Segments.Award))
                {
                    aeDetails.SegmentDetails.Add(new SegmentDetails
                    {
                        Order = 5,
                        Entity = "Award",
                        Code = data.PpmSegmentStringValidate.Segments.Award,
                        Name = string.Empty
                    });
                }

                if (!string.IsNullOrWhiteSpace(data.PpmSegmentStringValidate.Segments.FundingSource))
                {
                    aeDetails.SegmentDetails.Add(new SegmentDetails
                    {
                        Order = 6,
                        Entity = "Funding Source",
                        Code = data.PpmSegmentStringValidate.Segments.FundingSource,
                        Name = string.Empty
                    });
                }

                if (data.PpmProjectByNumber?.LegalEntityCode != null)
                {
                    var segment = new SegmentDetails
                    {
                        Order = 7,
                        Entity = "Legal Entity",
                        Code = data.PpmProjectByNumber.LegalEntityCode,
                    };
                    var entityResult = await Entity(segment.Code);
                    var entityData = entityResult.Where(a => a.Code == segment.Code).FirstOrDefault();
                    if (entityData != null)
                    {
                        segment.Name = entityData.Name;
                    }
                    aeDetails.SegmentDetails.Add(segment);
                }

                //Award specific GL info
                var awardDetail = aeDetails.SegmentDetails.SingleOrDefault(s => s.Entity == "Award");
                if(awardDetail != null)
                {
                    var awardResult = await GetAward(awardDetail.Code);
                    if(awardResult != null && awardResult.EligibleForUse)
                    {
                        awardDetail.Name = awardResult.Name;
                        if(awardResult.GlFundCode != null)
                        {
                            var segment = new SegmentDetails
                            {
                                Order = 8,
                                Entity = "GL Fund",
                                Code = awardResult.GlFundCode,
                            };
                            var fundResult = await Fund(segment.Code);
                            var fundData = fundResult.Where(a => a.Code == segment.Code).FirstOrDefault();
                            if(fundData != null)
                            {
                                segment.Name = fundData.Name;
                            }

                            aeDetails.SegmentDetails.Add(segment);
                        }
                        if(awardResult.GlPurposeCode != null)
                        {
                            var segment = new SegmentDetails
                            {
                                Order = 9,
                                Entity = "GL Purpose",
                                Code = awardResult.GlPurposeCode,
                            };
                            var purposeResult = await Purpose(segment.Code);
                            var purposeData = purposeResult.Where(a => a.Code == segment.Code).FirstOrDefault();
                            if(purposeData != null)
                            {
                                segment.Name = purposeData.Name;
                            }
                            aeDetails.SegmentDetails.Add(segment);
                        }
                    }

                }

                var fundingSourceDetail = aeDetails.SegmentDetails.SingleOrDefault(s => s.Entity == "Funding Source");
                if(fundingSourceDetail != null && fundingSourceDetail.Code != null)
                {
                    var fundingSourceResult = await FundingSource(fundingSourceDetail.Code);
                    var fundingSourceData = fundingSourceResult.Where(a => a.Code == fundingSourceDetail.Code).FirstOrDefault();
                    if(fundingSourceData != null)
                    {
                        fundingSourceDetail.Name = fundingSourceData.Name;
                    }
                }



                if(data.PpmTaskByProjectNumberAndTaskNumber?.GlPostingFundCode != null)
                {
                    var segment = new SegmentDetails
                    {
                        Order = 10,
                        Entity = "GL Posting Fund",
                        Code = data.PpmTaskByProjectNumberAndTaskNumber.GlPostingFundCode,
                    };
                    var fundResult = await Fund(segment.Code);
                    var fundData = fundResult.Where(a => a.Code == segment.Code).FirstOrDefault();
                    if(fundData != null)
                    {
                        segment.Name = fundData.Name;
                    }
                    aeDetails.SegmentDetails.Add(segment);
                }
                if(data.PpmTaskByProjectNumberAndTaskNumber?.GlPostingPurposeCode != null)
                {
                    var segment = new SegmentDetails
                    {
                        Order = 11,
                        Entity = "GL Posting Purpose",
                        Code = data.PpmTaskByProjectNumberAndTaskNumber.GlPostingPurposeCode,
                    };
                    var purposeResult = await Purpose(segment.Code);
                    var purposeData = purposeResult.Where(a => a.Code == segment.Code).FirstOrDefault();
                    if(purposeData != null)
                    {
                        segment.Name = purposeData.Name;
                    }
                    aeDetails.SegmentDetails.Add(segment);
                }

                if(data.PpmTaskByProjectNumberAndTaskNumber?.GlPostingProgramCode != null)
                {
                    var segment = new SegmentDetails
                    {
                        Order = 12,
                        Entity = "GL Posting Program",
                        Code = data.PpmTaskByProjectNumberAndTaskNumber.GlPostingProgramCode,
                    };
                    var programResult = await Program(segment.Code);
                    var programData = programResult.Where(a => a.Code == segment.Code).FirstOrDefault();
                    if(programData != null)
                    {
                        segment.Name = programData.Name;
                    }
                    aeDetails.SegmentDetails.Add(segment);
                }
                if(data.PpmTaskByProjectNumberAndTaskNumber?.GlPostingActivityCode != null)
                {
                    var segment = new SegmentDetails
                    {
                        Order = 13,
                        Entity = "GL Posting Activity",
                        Code = data.PpmTaskByProjectNumberAndTaskNumber.GlPostingActivityCode,
                    };
                    var activityResult = await Activity(segment.Code);
                    var activityData = activityResult.Where(a => a.Code == segment.Code).FirstOrDefault();
                    if(activityData != null)
                    {
                        segment.Name = activityData.Name;
                    }
                    aeDetails.SegmentDetails.Add(segment);
                }


                var entity   = data.PpmProjectByNumber?.LegalEntityCode ?? "0000";
                var fund     = data.PpmTaskByProjectNumberAndTaskNumber?.GlPostingFundCode ?? "00000";
                var dept     = data.ErpFinancialDepartment?.Code ?? "0000000";
                var account  = data.PpmExpenditureTypeByCode?.Code ?? "000000";
                var purpose  = data.PpmTaskByProjectNumberAndTaskNumber?.GlPostingPurposeCode ?? "00";
                var program  = data.PpmTaskByProjectNumberAndTaskNumber?.GlPostingProgramCode ?? "000";
                var project  = data.PpmProjectByNumber?.ProjectNumber ?? "0000000000";
                var activity = data.PpmTaskByProjectNumberAndTaskNumber?.GlPostingActivityCode ?? "000000";

                aeDetails.PpmGlString = $"{entity}-{fund}-{dept}-{account}-{purpose}-{program}-{project}-{activity}-0000-000000-000000";
                //TODO: Add PPM GL string to aeDetails to Match Cal's design


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
            var result = await _apiClient.ErpEntitySearch.ExecuteAsync(filter, query.ToUpperTrim());
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

            var result = await _apiClient.ErpFundSearch.ExecuteAsync(filter, query.ToUpperTrim());

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

            var result = await _apiClient.ErpDepartmentSearch.ExecuteAsync(filter, query.ToUpperTrim());

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

            var result = await _apiClient.ErpPurposeSearch.ExecuteAsync(filter, query.ToUpperTrim());

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

            var result = await _apiClient.ErpAccountSearch.ExecuteAsync(filter, query.ToUpperTrim());

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

            var result = await _apiClient.ErpProjectSearch.ExecuteAsync(filter, query.ToUpperTrim());

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

            var result = await _apiClient.ErpProgramSearch.ExecuteAsync(filter, query.ToUpperTrim());

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

            var result = await _apiClient.ErpActivitySearch.ExecuteAsync(filter, query.ToUpperTrim());

            var data = result.ReadData();

            var searchResults = data.ErpActivitySearch.Data.Where(a => a.EligibleForUse)
                .Select(d => new SearchResult(d.Code, d.Name));

            if (data.ErpActivity is { EligibleForUse: true })
            {
                searchResults = searchResults.Append(new SearchResult(data.ErpActivity.Code, data.ErpActivity.Name));
            }

            return searchResults.DistinctBy(p => p.Code);
        }

        public async Task<IGlValidateChartstring_GlValidateChartstring> GlValidate(string segmentString)
        {
            var result = await _apiClient.GlValidateChartstring.ExecuteAsync(segmentString, true);

            var data = result.ReadData();

            return data.GlValidateChartstring;
        }

        public async Task<IEnumerable<SearchResult>> PpmProject(string query)
        {
            var filter = new PpmProjectFilterInput { Name = new StringFilterInput { Contains = query.ToFuzzyQuery() } };

            var result = await _apiClient.PpmProjectSearch.ExecuteAsync(filter, query.ToUpperTrim());

            var data = result.ReadData();

            var searchResults = data.PpmProjectSearch.Data.Where(a => a.EligibleForUse)
                .Select(d => new SearchResult(d.ProjectNumber, d.Name));

            if (data.PpmProjectByNumber is { EligibleForUse: true })
            {
                searchResults =
                    searchResults.Append(new SearchResult(data.PpmProjectByNumber.ProjectNumber,
                        data.PpmProjectByNumber.Name));
            }

            return searchResults.DistinctBy(p => p.Code);
        }

        public async Task<IEnumerable<SearchResult>?> TasksByProject(string projectNumber)
        {
            var result = await _apiClient.PpmProjectWithTasks.ExecuteAsync(projectNumber);

            var data = result.ReadData();

            if (data.PpmProjectByNumber == null)
            {
                return null;
            }

            if (data.PpmProjectByNumber.Tasks == null)
            {
                return new SearchResult[] { };
            }

            return data.PpmProjectByNumber.Tasks.Where(a => a.EligibleForUse)
                .Select(t => new SearchResult(t.TaskNumber, t.Name));
        }

        public async Task<IEnumerable<SearchResult>?> Task(string query, string dependency)
        {
            if (string.IsNullOrEmpty(dependency))
            {
                return null;
            }

            // first, we need to get the project ID from the dependency
            var project = await _apiClient.PpmProjectSearch.ExecuteAsync(
                new PpmProjectFilterInput { ProjectNumber = new StringFilterInput { Eq = dependency } }, dependency);

            var projectData = project.ReadData();

            if (projectData.PpmProjectByNumber == null)
            {
                return null;
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


            return tasks.DistinctBy(p => p.Code);
        }

        public async Task<IEnumerable<SearchResult>> Organization(string query)
        {
            var filter = new PpmOrganizationFilterInput
            { Name = new StringFilterInput { Contains = query.ToFuzzyQuery() } };

            var result = await _apiClient.PpmOrganizationSearch.ExecuteAsync(filter, query.ToUpperTrim());

            var data = result.ReadData();

            var orgs = data.PpmOrganizationSearch.Data.Where(a => a.EligibleForUse)
                .Select(d => new SearchResult(d.Code, d.Name));

            if (data.PpmOrganization is { EligibleForUse: true })
            {
                orgs = orgs.Append(new SearchResult(data.PpmOrganization.Code, data.PpmOrganization.Name));
            }

            return orgs.DistinctBy(p => p.Code);
        }

        public async Task<IEnumerable<SearchResult>> ExpenditureType(string query)
        {
            var filter = new PpmExpenditureTypeFilterInput
            { Name = new StringFilterInput { Contains = query.ToFuzzyQuery() } };

            var result = await _apiClient.PpmExpenditureTypeSearch.ExecuteAsync(filter, query.ToUpperTrim());

            var data = result.ReadData();

            var searchResults = data.PpmExpenditureTypeSearch.Data.Where(a => a.EligibleForUse)
                .Select(d => new SearchResult(d.Code, d.Name));

            if (data.PpmExpenditureTypeByCode is { EligibleForUse: true })
            {
                searchResults = searchResults.Append(new SearchResult(data.PpmExpenditureTypeByCode.Code,
                    data.PpmExpenditureTypeByCode.Name));
            }

            return searchResults.DistinctBy(p => p.Code);
        }

        public async Task<IEnumerable<SearchResult>> Award(string query)
        {
            var filter = new PpmAwardFilterInput() { Name = new StringFilterInput { Contains = query } };

            var result = await _apiClient.PpmAwardSearch.ExecuteAsync(filter, query.ToUpperTrim());

            var data = result.ReadData();

            var searchResults =
                data.PpmAwardSearch.Data.Where(a => a.EligibleForUse).Select(
                    d => new SearchResult(d.AwardNumber ?? string.Empty, d.Name ?? string.Empty));

            if (data.PpmAwardByNumber is { EligibleForUse: true })
            {
                searchResults = searchResults.Append(new SearchResult(data.PpmAwardByNumber.AwardNumber ?? string.Empty,
                    data.PpmAwardByNumber.Name ?? string.Empty));
            }

            return searchResults.DistinctBy(p => p.Code);
        }

        public async Task<IPpmAward_PpmAwardByNumber?> GetAward(string? query)
        {
            if(string.IsNullOrWhiteSpace(query))
            {
                return null;
            }
            var result = await _apiClient.PpmAward.ExecuteAsync(query.ToUpperTrim());

            var data = result.ReadData();

            return data.PpmAwardByNumber;
        }

        public async Task<IEnumerable<SearchResult>> FundingSource(string query)
        {
            var filter = new PpmFundingSourceFilterInput()
            { Name = new StringFilterInput { Contains = query.ToFuzzyQuery() } };

            var result = await _apiClient.PpmFundingSourceSearch.ExecuteAsync(filter, query.ToUpperTrim());

            var data = result.ReadData();

            var searchResults =
                data.PpmFundingSourceSearch.Data.Where(a => a.EligibleForUse)
                    .Select(d => new SearchResult(d.FundingSourceNumber, d.Name));

            if (data.PpmFundingSourceByNumber is { EligibleForUse: true })
            {
                searchResults = searchResults.Append(new SearchResult(data.PpmFundingSourceByNumber.FundingSourceNumber,
                    data.PpmFundingSourceByNumber.Name));
            }

            return searchResults.DistinctBy(p => p.Code);
        }

        public async Task<IPpmSegmentStringValidate_PpmSegmentStringValidate> PpmValidate(string segmentString)
        {
            var result = await _apiClient.PpmSegmentStringValidate.ExecuteAsync(segmentString);

            var data = result.ReadData();

            // TODO: need to get full segment values from the data        
            return data.PpmSegmentStringValidate;
        }
    }
}