using System.Security.Claims;
using Finjector.Core.Data;
using Finjector.Core.Domain;
using Finjector.Web.Controllers;
using Finjector.Web.Handlers;
using Finjector.Web.Models.Reports;
using Finjector.Web.Services.Reports;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

var checks = new (string Name, Action Run)[]
{
    ("Team admins see direct and inherited access throughout their team", CheckTeamAdmin),
    ("Folder-only admins cannot see standalone team or sibling-folder permissions", CheckFolderAdmin),
    ("Team view and edit permissions do not expand a folder admin's report", CheckMixedAccess),
    ("Scope filters only narrow authorized resources", CheckFilters),
    ("Inactive scopes are excluded but existing user grants remain visible", CheckInactiveScopes),
    ("Ownership, system roles, and unknown identities do not grant report access", CheckNoImplicitAccess),
    ("Personal team permissions follow the same authorization rules", CheckPersonalTeam),
    ("Missing claims and invalid scope IDs fail before querying", CheckRequestValidation),
    ("SQL Server translates every report scope without connecting to a database", CheckSqlTranslation)
};

var failures = 0;
foreach (var check in checks)
{
    try
    {
        check.Run();
        Console.WriteLine($"PASS {check.Name}");
    }
    catch (Exception exception)
    {
        failures++;
        Console.Error.WriteLine($"FAIL {check.Name}: {exception.Message}");
    }
}

Console.WriteLine($"{checks.Length - failures}/{checks.Length} access report checks passed.");
return failures == 0 ? 0 : 1;

static void CheckTeamAdmin()
{
    var fixture = CreateFixture();
    var rows = Report(fixture, "team-admin");
    Assert(rows.Count == 9, "Expected three team grants and three inherited grants on each of two folders.");
    Assert(rows.All(r => r.TeamId == 1), "An unrelated team's permissions leaked into the report.");
    Assert(rows.Count(r => r.FolderId == null && r.PermissionSource == "Team") == 3,
        "Team-level grants are missing.");
    Assert(rows.Where(r => r.FolderId.HasValue).Select(r => r.FolderId).Distinct().Order().SequenceEqual(new int?[] { 11, 12 }),
        "A team admin must see both active folders.");
    Assert(rows.All(r => r.UserName.Length > 0 && r.UserEmail.EndsWith("@example.test")),
        "User identity fields must be present.");

    AddFolderPermission(fixture.Folders.Single(f => f.Id == 11), fixture.Users[1], Role.Codes.Edit);
    rows = Report(fixture, "team-admin");
    var duplicateUser = rows.Where(r => r.FolderId == 11 && r.UserId == fixture.Users[1].Id).ToArray();
    Assert(duplicateUser.Length == 2 && duplicateUser.Any(r => r.PermissionSource == "Folder" && r.RoleName == Role.Codes.Edit) &&
        duplicateUser.Any(r => r.PermissionSource == "Inherited from team" && r.RoleName == Role.Codes.View),
        "Direct and inherited grants with different roles must both remain visible.");
}

static void CheckFolderAdmin()
{
    var fixture = CreateFixture();
    var folder = fixture.Folders.Single(f => f.Id == 11);
    AddFolderPermission(folder, fixture.Users[3], Role.Codes.Admin);
    AddFolderPermission(folder, fixture.Users[4], Role.Codes.Edit);
    var rows = Report(fixture, "folder-admin");

    Assert(rows.Count == 5 && rows.All(r => r.TeamId == 1 && r.FolderId == 11),
        "Folder admin access leaked team or sibling-folder rows.");
    Assert(rows.Count(r => r.PermissionSource == "Inherited from team") == 3,
        "Folder admins must see all inherited access to their folder.");
    Assert(rows.Any(r => r.UserId == fixture.Users[4].Id && r.RoleName == Role.Codes.Edit),
        "Direct folder grants are missing.");
}

static void CheckMixedAccess()
{
    foreach (var teamRole in new[] { Role.Codes.View, Role.Codes.Edit })
    {
        var fixture = CreateFixture();
        AddTeamPermission(fixture.Teams[0], fixture.Users[3], teamRole);
        AddFolderPermission(fixture.Folders[0], fixture.Users[3], Role.Codes.Admin);
        var rows = Report(fixture, "folder-admin");
        Assert(rows.Count == 5 && rows.All(r => r.FolderId == 11),
            $"Team {teamRole} incorrectly expanded the folder admin's report.");
    }
}

static void CheckFilters()
{
    var fixture = CreateFixture();
    AddFolderPermission(fixture.Folders[0], fixture.Users[3], Role.Codes.Admin);
    Assert(Report(fixture, "team-admin", teamId: 1).Count == 10, "Team filtering omitted authorized grants.");
    Assert(Report(fixture, "team-admin", folderId: 11).All(r => r.FolderId == 11),
        "A folder filter must exclude standalone team rows.");
    Assert(Report(fixture, "folder-admin", teamId: 1).All(r => r.FolderId == 11),
        "A team filter expanded a folder admin's scope.");
    Assert(Report(fixture, "folder-admin", folderId: 12).Count == 0, "An inaccessible sibling filter leaked data.");
    Assert(Report(fixture, "team-admin", teamId: 2).Count == 0, "An inaccessible team filter leaked data.");
    Assert(Report(fixture, "team-admin", teamId: 2, folderId: 11).Count == 0, "Conflicting scope IDs returned data.");
    Assert(Report(fixture, "team-admin", teamId: 999).Count == 0, "An unknown team returned data.");
    Assert(Report(fixture, "team-admin", folderId: 999).Count == 0, "An unknown folder returned data.");
}

static void CheckInactiveScopes()
{
    var fixture = CreateFixture();
    fixture.Folders[1].IsActive = false;
    fixture.Users[1].IsActive = false;
    var rows = Report(fixture, "team-admin");
    Assert(rows.Count == 6 && rows.All(r => r.FolderId != 12), "Inactive folder grants were included.");
    Assert(rows.Any(r => r.UserId == fixture.Users[1].Id), "An existing grant was hidden because the user is inactive.");

    fixture.Teams[0].IsActive = false;
    AddFolderPermission(fixture.Folders[0], fixture.Users[3], Role.Codes.Admin);
    Assert(Report(fixture, "team-admin").Count == 0, "Inactive team grants were included.");
    Assert(Report(fixture, "folder-admin").Count == 0, "A direct admin saw a folder under an inactive team.");
}

static void CheckNoImplicitAccess()
{
    var fixture = CreateFixture();
    fixture.Teams[0].Owner = fixture.Users[3];
    fixture.Teams[0].OwnerId = fixture.Users[3].Id;
    AddTeamPermission(fixture.Teams[0], fixture.Users[4], Role.Codes.System);
    foreach (var iamId in new[] { "viewer", "editor", "folder-admin", "other-user", "unknown", "", " " })
    {
        Assert(Report(fixture, iamId).Count == 0, $"Identity '{iamId}' received access without an Admin grant.");
    }
}

static void CheckPersonalTeam()
{
    var fixture = CreateFixture();
    fixture.Teams[0].IsPersonal = true;
    Assert(Report(fixture, "team-admin").Count == 9, "Personal-team admin grants should remain reportable.");
    Assert(Report(fixture, "viewer").Count == 0, "A personal-team viewer received admin report access.");
}

static void CheckRequestValidation()
{
    var accessor = new HttpContextAccessor { HttpContext = new DefaultHttpContext() };
    var controller = new UserController(accessor, null!, null!, null!);
    Assert(controller.AccessReport().GetAwaiter().GetResult() is UnauthorizedResult,
        "Missing IAM claims must return Unauthorized without accessing the database.");

    accessor.HttpContext.User = new ClaimsPrincipal(new ClaimsIdentity(new[]
    {
        new Claim(IamIdClaimFallbackTransformer.ClaimType, "team-admin")
    }));
    Assert(controller.AccessReport(teamId: 0).GetAwaiter().GetResult() is BadRequestObjectResult,
        "A zero team ID must return BadRequest.");
    Assert(controller.AccessReport(folderId: -1).GetAwaiter().GetResult() is BadRequestObjectResult,
        "A negative folder ID must return BadRequest.");
}

static void CheckSqlTranslation()
{
    // Query translation never opens this placeholder connection or reads application configuration.
    var options = new DbContextOptionsBuilder<AppDbContextSqlServer>()
        .UseSqlServer("Server=localhost;Database=AccessReportChecks;Integrated Security=true;TrustServerCertificate=true")
        .Options;
    using var context = new AppDbContextSqlServer(options);
    foreach (var scope in new (int? TeamId, int? FolderId)[] { (null, null), (1, null), (null, 11), (1, 11) })
    {
        var sql = UserAccessReportService.BuildQuery(context.Teams, context.Folders, "team-admin", scope.TeamId, scope.FolderId)
            .ToQueryString();
        Assert(sql.Contains("SELECT", StringComparison.OrdinalIgnoreCase) &&
            sql.Split("UNION ALL", StringSplitOptions.None).Length == 3,
            "SQL Server did not translate all three grant sources into one query.");
    }
}

static (List<Team> Teams, List<Folder> Folders, List<User> Users) CreateFixture()
{
    var identities = new[] { "team-admin", "viewer", "editor", "folder-admin", "other-user", "unrelated-admin" };
    var users = identities.Select((iam, index) => new User
    {
        Id = index + 1,
        Iam = iam,
        FirstName = "Test",
        LastName = iam,
        Email = $"{iam}@example.test"
    }).ToList();
    var team = new Team { Id = 1, Name = "Alpha", IsPersonal = false, Owner = users[0], OwnerId = users[0].Id };
    AddTeamPermission(team, users[0], Role.Codes.Admin);
    AddTeamPermission(team, users[1], Role.Codes.View);
    AddTeamPermission(team, users[2], Role.Codes.Edit);
    var folders = new[] { 11, 12 }.Select(id => new Folder
    {
        Id = id,
        Name = $"Folder {id}",
        Team = team,
        TeamId = team.Id
    }).ToList();
    team.Folders.AddRange(folders);
    var unrelatedTeam = new Team
    {
        Id = 2, Name = "Beta", IsPersonal = false, Owner = users[5], OwnerId = users[5].Id
    };
    AddTeamPermission(unrelatedTeam, users[5], Role.Codes.Admin);
    var unrelatedFolder = new Folder { Id = 21, Name = "Other folder", Team = unrelatedTeam, TeamId = unrelatedTeam.Id };
    unrelatedTeam.Folders.Add(unrelatedFolder);
    folders.Add(unrelatedFolder);
    return (new List<Team> { team, unrelatedTeam }, folders, users);
}

static void AddTeamPermission(Team team, User user, string role)
{
    team.TeamPermissions.Add(new TeamPermission
    {
        Team = team, TeamId = team.Id, User = user, UserId = user.Id, Role = new Role { Name = role }
    });
}

static void AddFolderPermission(Folder folder, User user, string role)
{
    folder.FolderPermissions.Add(new FolderPermission
    {
        Folder = folder, FolderId = folder.Id, User = user, UserId = user.Id, Role = new Role { Name = role }
    });
}

static List<UserAccessReportRow> Report(
    (List<Team> Teams, List<Folder> Folders, List<User> Users) fixture,
    string iamId,
    int? teamId = null,
    int? folderId = null) =>
    UserAccessReportService.BuildQuery(fixture.Teams.AsQueryable(), fixture.Folders.AsQueryable(), iamId, teamId, folderId).ToList();

static void Assert(bool condition, string message)
{
    if (!condition)
    {
        throw new InvalidOperationException(message);
    }
}
