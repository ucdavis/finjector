using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Finjector.Web.Controllers;

public class AccountController : Controller
{
    [Authorize(AuthenticationSchemes = OpenIdConnectDefaults.AuthenticationScheme)] // trigger authentication
    public IActionResult Login(string? returnUrl)
    {
        // redirect to return url if it exists, otherwise /
        return Redirect(returnUrl ?? "/");
    }
}