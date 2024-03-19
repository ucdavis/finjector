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
using Finjector.Core.Data;
using System.Configuration;
using Microsoft.EntityFrameworkCore;
using Finjector.Web.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.StaticFiles.Infrastructure;

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
        IndexFormat = "aspnet-finjector-{0:yyyy.MM}",
        TypeName = null
    });
}

Log.Logger = loggerConfig.CreateLogger();

try
{
    Log.Information("Configuring web host");

    // Add services to the container.
    builder.Services.Configure<FinancialOptions>(builder.Configuration.GetSection("Financial"));
    builder.Services.Configure<AuthOptions>(builder.Configuration.GetSection("Authentication"));
    builder.Services.Configure<SystemOptions>(builder.Configuration.GetSection("System"));

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
    builder.Services.AddAuthorization(options =>
    {
        options.AddAccessPolicy(AccessCodes.SystemAccess);
    });
    builder.Services.AddScoped<IAuthorizationHandler, VerifyRoleAccessHandler>();

    // Add the IamId to claims if not provided by CAS
    builder.Services.AddScoped<IClaimsTransformation, IamIdClaimFallbackTransformer>();
    builder.Services.AddScoped<IIdentityService, IdentityService>(); //Lookup IAM to get user
    builder.Services.AddScoped<IUserService, UserService>();
    builder.Services.AddScoped<IAggieEnterpriseService, AggieEnterpriseService>();

    builder.Services.AddDbContextPool<AppDbContext, AppDbContextSqlServer>((serviceProvider, o) =>
    {
        o.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"),
                sqlOptions =>
                {
                    sqlOptions.MigrationsAssembly("Finjector.Core");
                });
    });

    var app = builder.Build();


    // Configure the HTTP request pipeline.
    if (!app.Environment.IsDevelopment())
    {
        // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
        app.UseHsts();
    }
    
    // we want to disable caching for all html responses outside of the API
    app.Use(async (context, next) =>
    {
        context.Response.OnStarting(() =>
        {
            if (context.Request.Path.StartsWithSegments("/api") == false &&
                // ReSharper disable once ConditionIsAlwaysTrueOrFalseAccordingToNullableAPIContract
                context.Response.ContentType != null &&
                context.Response.ContentType.StartsWith("text/html", StringComparison.OrdinalIgnoreCase))
            {
                // Set the necessary headers to disable caching
                context.Response.Headers[Microsoft.Net.Http.Headers.HeaderNames.CacheControl] =
                    "no-store, no-cache, must-revalidate";
                context.Response.Headers[Microsoft.Net.Http.Headers.HeaderNames.Pragma] = "no-cache";
                context.Response.Headers[Microsoft.Net.Http.Headers.HeaderNames.Expires] = "0";
            }

            return Task.CompletedTask;
        });

        await next();
    });

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
        name: "system",
        pattern: "/{controller}/{action}/{id?}",
        constraints: new { controller = "System" });

    app.MapControllerRoute(
        name: "api",
        pattern: "/api/{controller}/{action=Index}/{id?}");

    app.MapFallbackToFile("index.html");

    using (var scope = app.Services.CreateScope())
    {
        var services = scope.ServiceProvider;
        try
        {
            var context = services.GetRequiredService<AppDbContext>();
            var initialize = new DbInitializer(context);
            initialize.Initialize().GetAwaiter().GetResult();
            //context.Database.Migrate();
        }
        catch (Exception ex)
        {
            Log.Fatal(ex, "An error occurred while migrating or initializing the database.");
        }
    }



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
