using Finjector.Core.Domain;
using Finjector.Core.Models;
using Finjector.Web.Handlers;
using Microsoft.AspNetCore.Authorization;

namespace Finjector.Web.Extensions;

public static class AuthorizationExtensions
{
    public static void AddAccessPolicy(this AuthorizationOptions options, string policy)
    {
        options.AddPolicy(policy, builder => builder.Requirements.Add(new VerifyRoleAccess(GetRoles(policy))));
    }

    public static string[] GetRoles(string accessCode)
    {
        return accessCode switch
        {
            // System requirement can only be fulfilled by a system user
            AccessCodes.SystemAccess => new[] { Role.Codes.System },
            _ => throw new ArgumentException($"{nameof(accessCode)} is not a valid {nameof(AccessCodes)} constant")
        };
    }
}

