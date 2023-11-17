namespace Finjector.Core.Models
{
    public class SearchResult
    {
        public SearchResult(string code, string name)
        {
            Code = code;
            Name = name;
        }

        public string Code { get; set; }
        public string Name { get; set; }
    }
}