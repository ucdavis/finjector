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

    [Authorize] // trigger authentication
    public IActionResult Login(string? returnUrl)
    {
        // attempt to add custom cookie
        this.httpContextAccessor.HttpContext?.Response.Cookies.Append("ASPNET_AUTH_SESSION", "true", new CookieOptions { 
            HttpOnly = false, // need client to read it
            Secure = true,
            SameSite = SameSiteMode.Lax,
            Expires = DateTime.Now.AddYears(1) // same expiration as auth cookie
        });

        // redirect to return url if it exists, otherwise /
        return Redirect(returnUrl ?? "/");
    }
}