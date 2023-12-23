using Finjector.Core.Data;
using Finjector.Core.Models;
using Finjector.Core.Services;
using Finjector.Web.Handlers;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Serilog;
using System.Security.Claims;

namespace Finjector.Web.Controllers;

[Authorize]
public class SystemController : Controller
{
    private readonly AppDbContext _dbContext;
    private readonly IIdentityService _identityService;
    private readonly IUserService _userService;

    public SystemController(AppDbContext dbContext, IIdentityService identityService, IUserService userService)
    {
        _dbContext = dbContext;
        _identityService = identityService;
        _userService = userService;
    }

    [Authorize(Policy = AccessCodes.SystemAccess)]
    public async Task<IActionResult> Emulate(string id)
    {
        var iamId = Request.HttpContext.User.FindFirstValue(IamIdClaimFallbackTransformer.ClaimType);
        var currentUser = await _userService.EnsureUserExists(iamId);
        Log.Information($"Emulation attempted for {id} by {currentUser.Name}");
        var lookupVal = id.Trim();

        var user = await _dbContext.Users.SingleOrDefaultAsync(u => u.Email == lookupVal || u.Kerberos == lookupVal);
        if (user == null)
        {
            // not found in db, look up user in IAM
            user = lookupVal.Contains("@")
                ? await _identityService.GetByEmail(lookupVal)
                : await _identityService.GetByKerberos(lookupVal);

            if (user != null)
            {
                // user found in IAM but not in our db
                // let the UserService handle creating it and setting up account ownership when applicable
                await _userService.EnsureUserExists(user.Iam);
            }
            else
            {
                throw new Exception("User is null");
            }
        }

        var identity = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Kerberos),
                new Claim(ClaimTypes.Name, user.Kerberos),
                new Claim(ClaimTypes.GivenName, user.FirstName),
                new Claim(ClaimTypes.Surname, user.LastName),
                new Claim("name", user.Name),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim("ucdPersonIAMID", user.Iam),
            }, CookieAuthenticationDefaults.AuthenticationScheme);

        // kill old login
        await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);

        // create new login
        await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(identity));

        return LocalRedirect("/");
    }

    public async Task<IActionResult> EndEmulate()
    {
        await HttpContext.SignOutAsync();
        return LocalRedirect("/");
    }
}

