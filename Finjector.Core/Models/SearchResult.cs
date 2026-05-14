namespace Finjector.Core.Models
{
    public class SearchResult
    {
        public SearchResult(string code, string name, string? fundPurpose = null)
        {
            Code = code;
            Name = name;
            FundPurpose = fundPurpose;
        }

        public string Code { get; set; }
        public string Name { get; set; }
        public string? FundPurpose { get; set; }
    }
}
