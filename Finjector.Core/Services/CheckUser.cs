using Finjector.Core.Data;
using Finjector.Core.Domain;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Finjector.Core.Services
{
    public interface ICheckUser
    {
        Task<User> UpdateUser(User user);
    }

    public class CheckUser : ICheckUser
    {
        private readonly AppDbContext _context;

        public CheckUser(AppDbContext context)
        {
            _context = context;
        }

        public async Task<User> UpdateUser(User user)
        {
            var foundUser = _context.Users.FirstOrDefault(u => u.Iam == user.Iam);
            if (foundUser != null)
            {
                var update = false;
                if(foundUser.FirstName != user.FirstName)
                {
                    foundUser.FirstName = user.FirstName;
                    update = true;
                }
                if(foundUser.LastName != user.LastName)
                {
                    foundUser.LastName = user.LastName;
                    update = true;
                }
                if(update)
                {
                    await _context.SaveChangesAsync();
                }
            }
            else
            {
                try
                {
                    var newUser = new User
                    {
                        Email = user.Email,
                        FirstName = user.FirstName,
                        LastName = user.LastName,
                        Iam = user.Iam,
                        Kerberos = user.Kerberos
                    };
                    var team = new Team
                    {
                        Name = "Personal",
                        Owner = newUser,
                        IsPersonal = true
                    };
                    team.TeamPermissions.Add(new TeamPermission
                    {
                        Role = await _context.Roles.SingleAsync(r => r.Name == Role.Codes.Admin),
                        User = newUser
                    });
                    team.Folders.Add(new Folder
                    {
                        Name = "Default",
                        Team = team
                    });


                    user.IsActive = true;
                    _context.Users.Add(newUser);
                    _context.Teams.Add(team);
                    await _context.SaveChangesAsync();
                }
                catch (Exception ex)
                {
                    var xxx = ex.Message;
                    throw new Exception("Error creating user");
                }
                //team.TeamPermissions.Add(new TeamPermission
                //{
                //    Role = await _context.Roles.SingleAsync(r => r.Name == Role.Codes.Admin),
                //    User = user
                //});
                //team.Folders.Add(new Folder
                //{
                //    Name = "Personal",
                //    Team = team
                //});

                //_context.Teams.Add(team);

            }

            return user;
        }
    }
}
