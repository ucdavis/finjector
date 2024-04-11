using Finjector.Core.Data;
using Finjector.Core.Services;
using Finjector.Web.Extensions;
using Finjector.Web.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Finjector.Core.Domain;
using Serilog;

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

            // Check if the user has permission to view the folder
            if (await _userService.VerifyFolderAccess(id, iamId, Role.Codes.View) == false)
            {
                return Unauthorized();
            }

            var folder = await _dbContext.Folders
                .Select(f => new
                {
                    f.Id,
                    f.Name,
                    f.Description,
                    f.IsDefault,
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

            if (folder == null)
            {
                return NotFound();
            }

            var charts = await _dbContext.Coas.Where(c => c.FolderId == id).OrderBy(a => a.Name).ToListAsync();

            return Ok(new { folder, charts });
        }

        [HttpGet("folderSearchList")]
        [ProducesResponseType(typeof(IEnumerable<Folder>), StatusCodes.Status200OK)]
        public async Task<IActionResult> FolderSearchList()
        {
            var iamId = Request.GetCurrentUserIamId();

            var folders = await _dbContext.Folders
               .Where(f => f.IsActive
                    && (f.FolderPermissions.Any(fp => fp.User.Iam == iamId &&
                        (fp.Role.Name == Role.Codes.Admin || fp.Role.Name == Role.Codes.Edit))
                    || f.Team.TeamPermissions.Any(tp => tp.User.Iam == iamId &&
                        (tp.Role.Name == Role.Codes.Admin || tp.Role.Name == Role.Codes.Edit))))
                .Select(f => new
                {
                    f.Id,
                    f.Name,
                    f.Description,
                    f.IsDefault,
                    TeamName = f.Team.Name,
                    TeamId = f.Team.Id,
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

            // Check if the user has permission to update the folder
            if (await _userService.VerifyFolderAccess(id, iamId, Role.Codes.Admin) == false)
            {
                return Unauthorized();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var folder = await _dbContext.Folders.FindAsync(id);
            if (folder == null)
            {
                return NotFound();
            }
            if (folder.IsDefault)
            {
                return BadRequest("Cannot update default folder");
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

            // make sure they have permission to create a folder in the team
            if (await _userService.VerifyTeamAccess(teamId, iamId, Role.Codes.Edit) == false)
            {
                return Unauthorized();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // get admin role
            var adminRole = await _dbContext.Roles.SingleAsync(r => r.Name == Role.Codes.Admin);

            var team = await _dbContext.Teams.FindAsync(teamId);
            if (team == null)
            {
                return NotFound();
            }
            if(team.IsPersonal)
            {
                return BadRequest("Cannot create folder in personal team");
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

        /// <summary>
        /// soft delete a folder by setting IsActive to false
        /// based off the delete team logic
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var iamId = Request.GetCurrentUserIamId();

            // make sure they have permission to delete the folder
            if (await _userService.VerifyFolderAccess(id, iamId, Role.Codes.Admin) == false)
            {
                return Unauthorized();
            }

            var folder = await _dbContext.Folders.SingleOrDefaultAsync(t => t.Id == id);

            if (folder == null)
            {
                return NotFound();
            }

            if (folder.IsDefault)
            {
                return BadRequest("Cannot delete default folder");
            }

            Log.Information("User {userId} Deleting folder {folderId} {folderName}", iamId, folder.Id, folder.Name);

            folder.IsActive = false;

            await _dbContext.SaveChangesAsync();

            return NoContent();
        }

        /// <summary>
        /// remove your permissions from a folder
        /// if you still have access via the team that's fine
        /// never delete the folder even if nobody can see it anymore since there will always be team access
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpPost("{id}/Leave")]
        public async Task<IActionResult> Leave(int id)
        {
            var iamId = Request.GetCurrentUserIamId();

            // make sure they have permission to view the folder
            if (await _userService.VerifyFolderAccess(id, iamId, Role.Codes.View) == false)
            {
                return Unauthorized();
            }

            var folder = await _dbContext.Folders.SingleOrDefaultAsync(f => f.Id == id);
            if(folder == null || folder.IsDefault) 
            {
                return BadRequest("Cannot leave default folder");
            }

            // find their folder permissions
            var folderPermissions = await _dbContext.FolderPermissions
                .Where(fp => fp.Folder.Id == id && fp.User.Iam == iamId)
                .ToListAsync();


            Log.Information("User {userId} Leaving folder {folderId}", iamId, id);

            _dbContext.FolderPermissions.RemoveRange(folderPermissions);

            await _dbContext.SaveChangesAsync();

            return NoContent();
        }
    }
}