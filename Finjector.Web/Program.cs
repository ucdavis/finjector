using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Microsoft.IdentityModel.Tokens;

using Finjector.Web.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.Configure<FinancialOptions>(builder.Configuration.GetSection("Financial"));

builder.Services.AddControllersWithViews();

builder.Services.AddHttpContextAccessor();

builder.Services.AddAuthentication(options =>
{
    options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
})
.AddCookie(options =>
{
    options.LoginPath = new PathString("/Account/Login/");
    options.Events.OnRedirectToLogin = (ctx) =>
    {
        // API requests shouldn't redirect to login
        if (ctx.Request.Path.StartsWithSegments("/api") && ctx.Response.StatusCode == 200)
            ctx.Response.StatusCode = 401;
        else
            ctx.Response.Redirect(ctx.RedirectUri);

        return Task.CompletedTask;
    };
})
.AddOpenIdConnect(oidc =>
{
    oidc.ClientId = builder.Configuration["Authentication:ClientId"];
    oidc.ClientSecret = builder.Configuration["Authentication:ClientSecret"];
    oidc.Authority = builder.Configuration["Authentication:Authority"];
    oidc.ResponseType = OpenIdConnectResponseType.Code;
    oidc.Scope.Add("openid");
    oidc.Scope.Add("profile");
    oidc.Scope.Add("email");
    oidc.Scope.Add("ucdProfile");
    oidc.Scope.Add("eduPerson");
    oidc.TokenValidationParameters = new TokenValidationParameters
    {
        NameClaimType = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
    };
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllerRoute(
    name: "login",
    pattern: "Account/Login",
    defaults: new { controller = "Account", action = "Login" });

app.MapControllerRoute(
    name: "api",
    pattern: "/api/{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html");

app.Run();
