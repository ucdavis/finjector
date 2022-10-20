using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Finjector.Web.Controllers;

public class AccountController : Controller
{
    private readonly IHttpContextAccessor httpContextAccessor;

    public AccountController(IHttpContextAccessor _httpContextAccessor)
    {
        this.httpContextAccessor = _httpContextAccessor;
    }

    [Authorize(AuthenticationSchemes = OpenIdConnectDefaults.AuthenticationScheme)] // trigger authentication
    public IActionResult Login(string? returnUrl)
    {
        // attempt to add custom cookie
        this.httpContextAccessor.HttpContext?.Response.Cookies.Append("ASPNET_AUTH_SESSION", "true", new CookieOptions
        {
            HttpOnly = false, // need client to read it
            Secure = true,
            SameSite = SameSiteMode.Lax
        });

        // redirect to return url if it exists, otherwise /
        return Redirect(returnUrl ?? "/");
    }
}