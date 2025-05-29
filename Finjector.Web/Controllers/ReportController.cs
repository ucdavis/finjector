using Finjector.Core.Data;
using Finjector.Core.Domain;
using Finjector.Core.Services;
using Finjector.Web.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Finjector.Web.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ReportController : ControllerBase
    {
        private readonly AppDbContext _dbContext;
        private readonly IUserService _userService;

        public ReportController(AppDbContext dbContext, IUserService userService)
        {
            _dbContext = dbContext;
            _userService = userService;
        }

        public async Task<ActionResult> Permissions()
        {
            // Get the current user
            var iamId = Request.GetCurrentUserIamId();

            // Get all the teams where the user is an admin
            var teamIds = await _dbContext.Teams
                .Include(t => t.TeamPermissions)
                .Where(t => t.TeamPermissions.Any(tp => tp.User.Iam == iamId && tp.Role.Name == Role.Codes.Admin)).Select(t => t.Id)
                .ToListAsync();
            //Get all the folderIds belonging to the TeamIds
            var teamFolderIds = await _dbContext.Folders
                .Include(f => f.Team)
                .Where(f => teamIds.Contains(f.TeamId))
                .Select(f => f.Id)
                .ToListAsync();

            // Get all the folders where the user is an admin
            var folderIds = await _dbContext.Folders
                .Include(f => f.FolderPermissions)
                .Where(f => f.FolderPermissions.Any(fp => fp.User.Iam == iamId && fp.Role.Name == Role.Codes.Admin)).Select(f => f.Id)
                .ToListAsync();

            // I want to list: TeamId, TeamName, FolderId (nullable), FolderName (nullable), UserId, UserName, UserEmail, RoleName

        }
    }
}
