using System;

namespace Finjector.Web.Models
{
    public class AuthOptions
    {
        public string Authority { get; set; } = "";
        public string ClientId { get; set; } = "";
        public string ClientSecret { get; set; } = "";
        public string IamKey { get; set; } = "";
    }
}
