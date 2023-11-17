namespace Finjector.Core.Models
{
    public class FinancialOptions
    {
        public string? ApiUrl { get; set; }
        public string? ApiToken { get; set; }

        public string? ConsumerKey { get; set; }
        public string? ConsumerSecret { get; set; }

        public string? TokenEndpoint { get; set; }
        public string? ScopeApp { get; set; }
        public string? ScopeEnv { get; set; }
    }
}