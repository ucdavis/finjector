using Finjector.Core.Data;
using Finjector.Core.Services;
using Finjector.Web.Extensions;
using Finjector.Web.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Finjector.Core.Domain;

namespace Finjector.Web.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class FolderController : ControllerBase
    {
        private readonly AppDbContext _dbContext;
        private readonly IUserService _userService;

        public FolderController(AppDbContext dbContext, IUserService userService)
        {
            _dbContext = dbContext;
            _userService = userService;
        }

        /// <summary>
        /// Get information about a specific folder
        /// Includes folder info, permissions for that folder, as well as some metadata about the charts
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var iamId = Request.GetCurrentUserIamId();

            var folder = await _dbContext.Folders
                .Select(f => new
                {
                    f.Id,
                    f.Name,
                    f.Description,
                    TeamName = f.Team.Name,
                    TeamId = f.Team.Id,
                    TeamIsPersonal = f.Team.IsPersonal,
                    MyFolderPermissions =
                        f.FolderPermissions.Where(fp => fp.User.Iam == iamId).Select(fp => fp.Role.Name),
                    MyTeamPermissions = f.Team.TeamPermissions.Where(tp => tp.User.Iam == iamId)
                        .Select(tp => tp.Role.Name),
                })
                .AsSplitQuery()
                .SingleOrDefaultAsync(f => f.Id == id);

            var charts = await _dbContext.Coas.Where(c => c.FolderId == id).ToListAsync();

            return Ok(new { folder, charts });
        }

        [HttpGet("search")]
        [ProducesResponseType(typeof(IEnumerable<Folder>), StatusCodes.Status200OK)]
        public async Task<IActionResult> Search([FromQuery] string query)
        {
            var iamId = Request.GetCurrentUserIamId();

            var folders = await _dbContext.Folders
                .Where(f => (f.Name.Contains(query) || f.Team.Name.Contains(query)) 
                            && (f.FolderPermissions.Any(fp => fp.User.Iam == iamId) 
                            || f.Team.TeamPermissions.Any(tp => tp.User.Iam == iamId)))
                .Select(f => new
                {
                    f.Id,
                    f.Name,
                    f.Description,
                    TeamName = f.Team.Name,
                    TeamId = f.Team.Id,
                    TeamIsPersonal = f.Team.IsPersonal,
                    MyFolderPermissions =
                        f.FolderPermissions.Where(fp => fp.User.Iam == iamId).Select(fp => fp.Role.Name),
                    MyTeamPermissions = f.Team.TeamPermissions.Where(tp => tp.User.Iam == iamId)
                        .Select(tp => tp.Role.Name),
                })
                .AsNoTracking()
                .ToListAsync();

            return Ok(folders);
        }

        // PUT api/folder/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] NameAndDescriptionModel model)
        {
            var iamId = Request.GetCurrentUserIamId();

            var folder = await _dbContext.Folders.FindAsync(id);
            if (folder == null)
            {
                return NotFound();
            }

            // Check if the user has permission to update the folder
            if (await _userService.VerifyFolderAccess(id, iamId, Role.Codes.Admin) == false)
            {
                return Unauthorized();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            folder.Name = model.Name;
            folder.Description = model.Description;

            _dbContext.Folders.Update(folder);
            await _dbContext.SaveChangesAsync();

            return Ok(folder);
        }

        // POST api/folder?teamId=123
        [HttpPost]
        public async Task<IActionResult> Create(int teamId, [FromBody] NameAndDescriptionModel model)
        {
            var iamId = Request.GetCurrentUserIamId();

            var user = await _dbContext.Users.SingleOrDefaultAsync(u => u.Iam == iamId);

            if (user == null)
            {
                return BadRequest("User not found");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // make sure they have permission to create a folder in the team
            if (await _userService.VerifyTeamAccess(teamId, iamId, Role.Codes.Edit) == false)
            {
                return Unauthorized();
            }

            // get admin role
            var adminRole = await _dbContext.Roles.SingleAsync(r => r.Name == Role.Codes.Admin);

            var team = await _dbContext.Teams.FindAsync(teamId);
            if (team == null)
            {
                return NotFound();
            }

            var folder = new Folder
            {
                Name = model.Name,
                Description = model.Description,
                TeamId = teamId,
                IsActive = true,
                FolderPermissions = new List<FolderPermission>
                {
                    new FolderPermission()
                    {
                        Role = adminRole,
                        User = user
                    }
                }
            };

            _dbContext.Folders.Add(folder);
            await _dbContext.SaveChangesAsync();

            return Ok(folder);
        }
    }
}