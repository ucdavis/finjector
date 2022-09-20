using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Finjector.Web.Controllers;


[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UserController : ControllerBase
{
    private readonly IHttpContextAccessor httpContextAccessor;

    public UserController(IHttpContextAccessor _httpContextAccessor)
    {
        this.httpContextAccessor = _httpContextAccessor;
    }

    [HttpGet("info")]
    public IActionResult Info()
    {
        var claims = this.httpContextAccessor.HttpContext?.User.Claims;

        if (claims == null)
        {
            return Challenge(); // trigger authentication, but claims should never be null here
        }

        return Ok(claims.ToDictionary(c => c.Type, c => c.Value));
    }
}