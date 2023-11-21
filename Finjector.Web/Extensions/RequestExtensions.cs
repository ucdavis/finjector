using System.Security.Claims;
using Finjector.Web.Handlers;

namespace Finjector.Web.Extensions;

public static class RequestExtensions
{
    public static string GetCurrentUserIamId(this HttpRequest request)
    {
        return request.HttpContext.User.FindFirstValue(IamIdClaimFallbackTransformer.ClaimType);
    }
}