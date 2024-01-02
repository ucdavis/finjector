using Finjector.Core.Domain;
using Finjector.Core.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System.Security.Claims;

namespace Finjector.Web.Handlers;

/// <summary>
/// Currently only being used to verify system access, but can be expanded to verify other roles
/// </summary>
public class VerifyRoleAccessHandler : AuthorizationHandler<VerifyRoleAccess>
{
    private readonly IHttpContextAccessor _httpContext;
    private readonly SystemOptions _systemOptions;

    public VerifyRoleAccessHandler(IHttpContextAccessor httpContext, IOptions<SystemOptions> systemOptions)
    {
        _httpContext = httpContext;
        _systemOptions = systemOptions.Value;
    }
    protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, VerifyRoleAccess requirement)
    {
        var kerbId = context.User.Claims.SingleOrDefault(a => a.Type == ClaimTypes.NameIdentifier)?.Value;


        if (string.IsNullOrWhiteSpace(kerbId))
        {
            return Task.CompletedTask;
        }

        if (requirement.RoleStrings.Contains(Role.Codes.System) && _systemOptions.GetUsers.Contains(kerbId))
        {
            context.Succeed(requirement);
        }

        return Task.CompletedTask;
    }
}
