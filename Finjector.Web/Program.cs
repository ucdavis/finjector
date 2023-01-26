using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Microsoft.IdentityModel.Tokens;

using Finjector.Web.Models;
using Finjector.Core.Models;
using Finjector.Core.Services;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using Serilog;
using Serilog.Events;
using Serilog.Exceptions;
using Serilog.Sinks.Elasticsearch;
using Finjector.Web;
using Microsoft.AspNetCore.Authentication;
using Finjector.Web.Handlers;

#if DEBUG
Serilog.Debugging.SelfLog.Enable(msg => Debug.WriteLine(msg));
#endif

var builder = WebApplication.CreateBuilder(args);

var loggingSection = builder.Configuration.GetSection("Serilog");

var loggerConfig = new LoggerConfiguration()
    .MinimumLevel.Debug()
    .MinimumLevel.Override("Microsoft", LogEventLevel.Information)
    // .MinimumLevel.Override("Microsoft.EntityFrameworkCore", LogEventLevel.Warning) // uncomment this to hide EF core general info logs
    .MinimumLevel.Override("Microsoft.AspNetCore", LogEventLevel.Warning)
    .MinimumLevel.Override("System", LogEventLevel.Warning)
    .Enrich.FromLogContext()
    .Enrich.WithClientIp()
    .Enrich.WithClientAgent()
    .Enrich.WithExceptionDetails()
    .Enrich.WithProperty("Application", loggingSection.GetValue<string>("AppName"))
    .Enrich.WithProperty("AppEnvironment", loggingSection.GetValue<string>("Environment"))
    .WriteTo.Console();

// add in elastic search sink if the uri is valid
if (Uri.TryCreate(loggingSection.GetValue<string>("ElasticUrl"), UriKind.Absolute, out var elasticUri))
{
    loggerConfig.WriteTo.Elasticsearch(new ElasticsearchSinkOptions(elasticUri)
    {
        IndexFormat = "aspnet-finjector-{0:yyyy.MM}"
    });
}

Log.Logger = loggerConfig.CreateLogger();

try
{
    Log.Information("Configuring web host");

    // Add services to the container.
    builder.Services.Configure<FinancialOptions>(builder.Configuration.GetSection("Financial"));
    builder.Services.Configure<CosmosOptions>(builder.Configuration.GetSection("CosmosDb"));
    builder.Services.Configure<AuthOptions>(builder.Configuration.GetSection("Authentication"));

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

    // It's an SDK best practice to use a singleton instance of CosmosClient
    builder.Services.AddSingleton<ICosmosDbService, CosmosDbService>();
    
    // Add the IamId to claims if not provided by CAS
    builder.Services.AddScoped<IClaimsTransformation, IamIdClaimFallbackTransformer>();

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

    Log.Information("Starting web host");
    app.Run();
    return 0;
}
catch (Exception ex)
{
    Log.Fatal(ex, "Application start-up failed");
    return 1;
}
finally
{
    Log.CloseAndFlush();
}
